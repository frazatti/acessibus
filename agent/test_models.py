from dotenv import load_dotenv
import os
import sys

load_dotenv("acessibus/.env")

api_key = os.environ.get("GOOGLE_API_KEY")
from google import genai
client = genai.Client(api_key=api_key)
for m in client.models.list():
    if "live" in m.name.lower() or "exp" in m.name.lower():
        print(m.name)
