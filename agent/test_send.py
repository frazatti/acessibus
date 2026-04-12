from google.genai import types
from google.adk.models.gemini_llm_connection import GeminiLlmConnection
from pydantic import BaseModel

print("Is LiveClientContent a dict?", issubclass(types.LiveClientContent, dict))
print("Is it Sequence?", isinstance(types.LiveClientContent(), list))
