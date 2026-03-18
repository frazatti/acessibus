from fastapi import FastAPI
import uvicorn
import asyncio
from modules import process_message
from models import ChatRequest


app = FastAPI()


@app.post("/chat")
async def chat(payload: ChatRequest):
    resposta = await process_message(payload)
    return {"response": resposta}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")