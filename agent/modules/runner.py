from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from pydantic import BaseModel
from acessibus import acessiBusAgent
from models import ChatRequest
from google.genai.types import Content, Part
from .persistence import save_interaction, load_session_history

APP_NAME = "acessibus"



async def process_message(data: ChatRequest):
    local_service = InMemorySessionService() 
    #nome_app = acessiBusAgent.name if hasattr(acessiBusAgent, 'name') else APP_NAME

    #Carrega o histórico do json antes de criar a sessão na memoria
    saved_messages = load_session_history(data.userID, data.sessionID)
    formatted_history = []
    
    if saved_messages:
        for msg in saved_messages:
            formatted_history.append(Content(role="user", parts=[Part(text=msg["user"])]))
            formatted_history.append(Content(role="model", parts=[Part(text=msg["agent"])]))
        print(f"Histórico preparado: {len(saved_messages)} mensagens.")

    #Cria a sessão do usuario na memória
    session = await local_service.create_session(
        app_name=APP_NAME,
        user_id=data.userID,
        session_id=data.sessionID
    )
    
    #Injeta o histórico caso exista
    if formatted_history:
        try:
            await local_service.update_session(
                    app_name=nome_app,
                    user_id=data.userID,
                    session_id=data.sessionID,
                    history=formatted_history
                )
        except Exception as e:
            print(f"Erro ao injetar histórico: {e}")

    #Inicia o runner
    runner = Runner(
        agent=acessiBusAgent,
        app_name=APP_NAME,
        session_service=local_service 
    )

    new_message = Content(role="user", parts=[Part(text=data.message)])

    
    events = runner.run_async(
        user_id=data.userID,
        session_id=data.sessionID,
        new_message=new_message
    )

    final_response = ""
    try:
        async for event in events:
            #Print pra ver oq ta acontecendo
            print(f"Evento recebido: {event}")
            
            if hasattr(event, "author") and event.author == APP_NAME:
                if event.is_final_response():
                    final_response = event.content.parts[0].text
                    break
    except Exception as e:
        print(f"Erro durante o stream: {e}")
        raise e

    if final_response:
        save_interaction(
            user_id=data.userID, 
            session_id=data.sessionID, 
            user_msg=data.message, 
            agent_msg=final_response
        )
    
    return final_response