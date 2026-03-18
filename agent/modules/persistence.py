import json
import os
from datetime import datetime

BASE_SESSIONS_DIR = "sessions"

def get_session_path(user_id: str, session_id: str):
    #Gera o caminho da sessão caso não exista
    path = os.path.join(BASE_SESSIONS_DIR, user_id, session_id)
    os.makedirs(path, exist_ok=True)
    return path

def save_interaction(user_id: str, session_id: str, user_msg: str, agent_msg: str):
    #Salva o history.json
    session_dir = get_session_path(user_id, session_id)
    file_path = os.path.join(session_dir, "history.json")
    
    #Carrega histórico existente
    history = []
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                history = json.load(f)
            except json.JSONDecodeError:
                history = []

    #Adiciona a nova interação com timestamp
    history.append({
        "timestamp": datetime.now().isoformat(),
        "user": user_msg,
        "agent": agent_msg
    })
    
    #Salva o arquivo
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=4, ensure_ascii=False)

def load_session_history(user_id: str, session_id: str):
    #Carrega o histórico da sessão especificada
    file_path = os.path.join(BASE_SESSIONS_DIR, user_id, session_id, "history.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []