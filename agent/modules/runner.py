from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.adk.events import Event 
from pydantic import BaseModel
from acessibus import acessiBusTextAgent, acessiBusAudioAgent
from models import ChatRequest
from google.genai.types import Content, Part
from google.genai import types
from .persistence import save_interaction, load_session_history
from typing import Optional
from fastapi import WebSocket, WebSocketDisconnect
from google.adk.agents.live_request_queue import LiveRequestQueue
import asyncio


APP_NAME = "acessibus"

async def process_text_message(data: ChatRequest, isAudio: Optional[bool] = False):
    # Instância local para garantir isolamento entre requests
    local_service = InMemorySessionService()
    
    # Tenta restaurar dados anteriores salvos (em JSON ou Firebase, dependendo da persistência)
    saved_data = load_session_history(data.userID, data.sessionID)
    
    # Extrai o cognitivo do agente (é como se fosse a "memória de trabalho" da conversa)
    initial_state = saved_data.get("state", {}) if isinstance(saved_data, dict) else {}

    # 2. Cria a sessão com o estado inicial
    session = await local_service.create_session(
        app_name=APP_NAME,
        user_id=data.userID,
        session_id=data.sessionID,
        state=initial_state
    )

    # Obter histórico de mensagens
    messages = saved_data.get("messages", []) if isinstance(saved_data, dict) else saved_data

    for msg in messages:
        # Evento do Usuário
        await local_service.append_event(
            session=session,
            event=Event(
                author="user", 
                content=Content(role="user", parts=[Part(text=msg["user"])])
            )
        )
        # Registramos a fala do Assistente para manter o fio da meada (O autor deve corresponder ao APP_NAME)
        await local_service.append_event(
            session=session,
            event=Event(
                author=APP_NAME, 
                content=Content(role="model", parts=[Part(text=msg["agent"])])
            )
        )

    # Injeta a dependência do agente no motor local de processamento (Runner)
    runner = Runner(
        agent=acessiBusTextAgent, 
        session_service=local_service,
        app_name=APP_NAME
    )
    
    # 4. Executa e coleta a resposta
    full_response = ""
    new_message_content = Content(role="user", parts=[Part(text=data.message)]) 

    # O Runner vai processar a new_message considerando o history que injetamos acima
    async for event in runner.run_async(
        user_id=data.userID,
        session_id=data.sessionID,
        new_message=new_message_content
    ):
        # Extrai o texto dos chunks da resposta
        if event.content and event.content.parts:
            for part in event.content.parts:
                if part.text:
                    full_response += part.text

    # 3. Processamento Finalizado: Salvamos o novo estado consolidado
    final_state = session.state 
    save_interaction(
        user_id=data.userID, 
        session_id=data.sessionID, 
        user_msg=data.message, 
        agent_msg=full_response, 
        current_state=final_state
    )

    return full_response

async def process_audio_stream(websocket: WebSocket, userID: str, sessionID: str):
    await websocket.accept()
    local_service = InMemorySessionService()
    
    saved_data = load_session_history(userID, sessionID)
    initial_state = saved_data.get("state", {}) if isinstance(saved_data, dict) else {}

    session = await local_service.create_session(
        app_name=APP_NAME,
        user_id=userID,
        session_id=sessionID,
        state=initial_state
    )

    # Como estamos lidando com um fluxo contínuo de áudio (live stream), optamos por 
    # não carregar o histórico estático inteiro mensagem a mensagem. Deixamos a API do Gemini 
    # gerenciar o contexto em tempo real, enquanto o ADK organiza a persistência local.

    runner = Runner(
        agent=acessiBusAudioAgent,
        session_service=local_service,
        app_name=APP_NAME
    )
    
    queue = LiveRequestQueue()

    async def receive_from_ws():
        try:
            while True:
                # Fica ouvindo os pacotes de áudio sendo transmitidos pelo frontend...
                data = await websocket.receive_bytes()
                
                # Encapsula os bytes usando realtime_input
                # A API exige explicitamente PCM a 16kHz via websockets:
                blob = types.Blob(mime_type="audio/pcm;rate=16000", data=data) 
                queue.send_realtime(blob)
        except WebSocketDisconnect:
            queue.close()
        except Exception as e:
            print(f"Erro no receive WS: {e}")
            queue.close()

    async def send_to_ws():
        try:
            # Iniciamos o loop do runner consumindo items da request queue
            async for event in runner.run_live(user_id=userID, session_id=sessionID, live_request_queue=queue):
                if hasattr(event, "content") and event.content and event.content.parts:
                    for part in event.content.parts:
                        # Para Audio puro, o agent responde com inline_data.data
                        if part.inline_data:
                            print(f"Recebendo resposta em ÁUDIO... ({len(part.inline_data.data)} bytes)")
                            await websocket.send_bytes(part.inline_data.data)
                        elif part.text:
                            print(f"Recebendo resposta em TEXTO: {part.text}")
        except Exception as e:
            if "1000" in str(e):
                print("Assistente encerrou a transmissão (Tudo OK).")
            else:
                print(f"Erro no envio WS: {e}")

    # Executa ambas rotinas paralelamente (leitura / escrita)
    await asyncio.gather(receive_from_ws(), send_to_ws())