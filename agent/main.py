from fastapi import FastAPI, WebSocket, Request
import uvicorn
import asyncio
from modules import process_text_message, process_audio_stream
from models import ChatRequest
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.cors import CORSMiddleware

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

# Rota WebSocket nativa dedicada exclusivamente a manter um canal contínuo de áudio (Live Stream)
@app.websocket("/ws/chat/{userID}/{sessionID}")
async def websocket_chat(websocket: WebSocket, userID: str, sessionID: str):
    await process_audio_stream(websocket, userID, sessionID)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")