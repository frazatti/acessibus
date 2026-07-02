from fastapi import FastAPI, WebSocket, Request, HTTPException
import uvicorn
import asyncio
from modules import process_text_message, process_audio_stream, inject_mock_gps
from models import ChatRequest
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Union
import hashlib
import json
import os
import math
import logging

# ============================================================================
# Monkey Patch da biblioteca google-adk
# ============================================================================
# Isso garante que a injeção de Mock GPS (textos curtos) funcione sem precisarmos
# alterar a biblioteca instalada no site-packages.
try:
    print("Tentando aplicar monkey patch em GeminiLlmConnection...", flush=True)
    from google.adk.models.gemini_llm_connection import GeminiLlmConnection
    from google.genai import types
    
    _original_send_content = GeminiLlmConnection.send_content

    async def _patched_send_content(self, content: types.Content):
        assert content.parts
        if not content.parts[0].function_response:
            # Desvio estratégico para Mock GPS e textos curtos em Live stream
            if len(content.parts) == 1 and content.parts[0].text:
                print("MonkeyPatch: Enviando texto curto via send_realtime_input", flush=True)
                await self._gemini_session.send_realtime_input(text=content.parts[0].text)
                return
        
        # Fluxo normal para outras situações
        await _original_send_content(self, content)

    GeminiLlmConnection.send_content = _patched_send_content
    print("Monkey patch aplicado com sucesso em GeminiLlmConnection.send_content", flush=True)

    _original_send_realtime = GeminiLlmConnection.send_realtime

    async def _patched_send_realtime(self, input):
        if isinstance(input, types.Blob):
            mime = getattr(input, "mime_type", "") or ""
            if mime.startswith("audio/"):
                print("MonkeyPatch: Enviando audio via parameter 'audio'", flush=True)
                await self._gemini_session.send_realtime_input(audio=input)
                return
            elif mime.startswith("video/"):
                print("MonkeyPatch: Enviando video via parameter 'video'", flush=True)
                await self._gemini_session.send_realtime_input(video=input)
                return
        await _original_send_realtime(self, input)

    GeminiLlmConnection.send_realtime = _patched_send_realtime
    print("Monkey patch aplicado com sucesso em GeminiLlmConnection.send_realtime", flush=True)
except Exception as e:
    print(f"ERRO CRÍTICO AO APLICAR MONKEY PATCH: {e}", flush=True)
    raise e
# ============================================================================

# Define que o limitador de requisições rastreará o IP dos usuários
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configura as respostas padrão de erro do FastAPI caso um limite seja atingido
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/chat")
# Aplica limite de requisições por IP (ex: 5 requisições por minuto) para evitar abusos
@limiter.limit("5/minute") 
async def chat(request: Request, payload: ChatRequest):
    # Redireciona o payload para o processador responsável apenas pelas respostas textuais
    resposta = await process_text_message(payload)
    return {"response": resposta}

class MockGpsRequest(BaseModel):
    sessionID: str
    message: str

@app.post("/mock-gps")
async def mock_gps(payload: MockGpsRequest):
    sucesso = await inject_mock_gps(payload.sessionID, payload.message)
    if sucesso:
        return {"status": "ok", "detail": "Mock injetado com sucesso na stream de áudio."}
    else:
        raise HTTPException(status_code=404, detail="Sessão de áudio não encontrada ou inativa.")

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
async def login(payload: LoginRequest):
    # Simula autenticação segura
    users_path = os.path.join(os.path.dirname(__file__), "users.json")
    
    if not os.path.exists(users_path):
        raise HTTPException(status_code=500, detail="Base de usuários não encontrada.")
    
    with open(users_path, "r") as f:
        data = json.load(f)
        users = data.get("users", [])
    
    # Gera hash da senha enviada
    password_hash = hashlib.sha256(payload.password.encode()).hexdigest()
    
    user = next((u for u in users if u["username"] == payload.username and u["password_hash"] == password_hash), None)
    
    if user:
        return {
            "status": "success",
            "token": "mock-jwt-token-12345", # Token fictício para a demo
            "user": {
                "name": user["name"],
                "username": user["username"]
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # Raio da Terra em metros
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

class PositionRequest(BaseModel):
    sessionID: str
    lat: float
    lng: float
    heading: Optional[float] = None
    targetLat: float
    targetLng: float

@app.post("/update-position")
async def update_position(payload: PositionRequest):
    # Tenta obter as coordenadas finais reais do destino da sessão ativa
    target_lat = payload.targetLat
    target_lng = payload.targetLng
    
    loaded_from_memory = False
    
    # 1. Tenta buscar em memória na sessão de áudio ativa (tempo real durante a chamada)
    try:
        from modules.runner import active_sessions
        active_session = active_sessions.get(payload.sessionID)
        if active_session and active_session.state:
            state = active_session.state
            if "target_lat" in state and "target_lng" in state:
                target_lat = state["target_lat"]
                target_lng = state["target_lng"]
                loaded_from_memory = True
                print(f"UpdatePosition: Usando coordenadas do destino em memória ativa (Live): ({target_lat}, {target_lng})", flush=True)
    except Exception as e:
        print(f"Erro ao buscar destino em memória ativa: {e}", flush=True)

    # 2. Se não estiver na memória, busca no histórico persistido em disco
    if not loaded_from_memory:
        try:
            from modules.persistence import load_session_history
            saved_data = load_session_history("admin", payload.sessionID)
            if isinstance(saved_data, dict) and "state" in saved_data:
                state = saved_data["state"]
                if "target_lat" in state and "target_lng" in state:
                    target_lat = state["target_lat"]
                    target_lng = state["target_lng"]
                    print(f"UpdatePosition: Usando coordenadas do destino em disco: ({target_lat}, {target_lng})", flush=True)
        except Exception as e:
            print(f"Erro ao buscar destino persistido em disco: {e}", flush=True)

    distancia = haversine(payload.lat, payload.lng, target_lat, target_lng)
    
    # Se estiver a menos de 300 metros, avisa o agente
    if distancia < 300:
        msg = f"Estamos chegando perto! Você está a aproximadamente {int(distancia)} metros do destino."
        # Se estiver MUITO perto, muda a mensagem
        if distancia < 50:
            msg = "Atenção! Você está chegando exatamente agora no ponto de descida."
            
        from modules import inject_mock_gps
        await inject_mock_gps(payload.sessionID, msg)
        return {"status": "alert_sent", "distance": distancia, "target_lat": target_lat, "target_lng": target_lng}
    
    return {"status": "ok", "distance": distancia, "target_lat": target_lat, "target_lng": target_lng}

# Rota WebSocket nativa dedicada exclusivamente a manter um canal contínuo de áudio (Live Stream)
@app.websocket("/ws/chat/{userID}/{sessionID}")
async def websocket_chat(websocket: WebSocket, userID: str, sessionID: str):
    await process_audio_stream(websocket, userID, sessionID)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")