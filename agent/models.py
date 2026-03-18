from pydantic import BaseModel

#class ChatHistory(BaseModel):
#    user: str
#    agent: str

class ChatRequest(BaseModel):
    userID: str
    name: str
    sessionID: str
    #history: ChatHistory
    message: str