import asyncio
from google.genai import types
from google.genai.live import AsyncSession
from unittest.mock import MagicMock

async def main():
    session = AsyncSession(api_client=MagicMock(), websocket=MagicMock())
    content = types.Content(role="user", parts=[types.Part(text="hello")])
    try:
        msg = session._parse_client_message(input=types.LiveClientContent(turns=[content], turn_complete=True))
        print("Parsed:", msg)
    except Exception as e:
        print("Exception:", str(e))

asyncio.run(main())
