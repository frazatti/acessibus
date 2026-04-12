import json
import os
from datetime import datetime

BASE_SESSIONS_DIR = "sessions"

def get_session_path(user_id: str, session_id: str):
    path = os.path.join(BASE_SESSIONS_DIR, user_id, session_id)
    os.makedirs(path, exist_ok=True)
    return path

# ADICIONE O PARÂMETRO current_state
def save_interaction(user_id: str, session_id: str, user_msg: str, agent_msg: str, current_state: dict):
    session_dir = get_session_path(user_id, session_id)
    file_path = os.path.join(session_dir, "history.json")
    
    # Estrutura inicial do arquivo se não existir
    data = {"messages": [], "state": {}}
    
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                pass

    # Atualiza as mensagens
    data["messages"].append({
        "timestamp": datetime.now().isoformat(),
        "user": user_msg,
        "agent": agent_msg
    })
    
    # ATUALIZA O ESTADO (Isso aqui cura o Alzheimer)
    data["state"] = current_state
    
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def load_session_history(user_id: str, session_id: str):
    file_path = os.path.join(BASE_SESSIONS_DIR, user_id, session_id, "history.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            # Agora retorna o dicionário completo com messages e state
            return json.load(f)
    # Retorna estrutura padrão vazia
    return {"messages": [], "state": {}}