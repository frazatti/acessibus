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
    from google.adk.models.gemini_llm_connection import GeminiLlmConnection
    from google.genai import types
    
    _adk_logger = logging.getLogger("adk_monkey_patch")
    _original_send_content = GeminiLlmConnection.send_content

    async def _patched_send_content(self, content: types.Content):
        assert content.parts
        if not content.parts[0].function_response:
            # Desvio estratégico para Mock GPS e textos curtos em Live stream
            if len(content.parts) == 1 and content.parts[0].text:
                _adk_logger.debug('MonkeyPatch: Enviando texto curto via send_realtime_input')
                await self._gemini_session.send_realtime_input(text=content.parts[0].text)
                return
        
        # Fluxo normal para outras situações
        await _original_send_content(self, content)

    GeminiLlmConnection.send_content = _patched_send_content
    _adk_logger.info("Monkey patch aplicado com sucesso em GeminiLlmConnection.send_content")
except ImportError:
    pass
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
    distancia = haversine(payload.lat, payload.lng, payload.targetLat, payload.targetLng)
    
    # Se estiver a menos de 300 metros, avisa o agente
    if distancia < 300:
        msg = f"Estamos chegando perto! Você está a aproximadamente {int(distancia)} metros do destino."
        # Se estiver MUITO perto, muda a mensagem
        if distancia < 50:
            msg = "Atenção! Você está chegando exatamente agora no ponto de descida."
            
        from modules import inject_mock_gps
        await inject_mock_gps(payload.sessionID, msg)
        return {"status": "alert_sent", "distance": distancia}
    
    return {"status": "ok", "distance": distancia}

# Rota WebSocket nativa dedicada exclusivamente a manter um canal contínuo de áudio (Live Stream)
@app.websocket("/ws/chat/{userID}/{sessionID}")
async def websocket_chat(websocket: WebSocket, userID: str, sessionID: str):
    await process_audio_stream(websocket, userID, sessionID)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")