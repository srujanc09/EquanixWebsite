# test_genai.py
import os, traceback
from google import genai

print("Env keys present:",
      "GEMINI_API_KEY" in os.environ,
      "GOOGLE_API_KEY" in os.environ,
      "GOOGLE_APPLICATION_CREDENTIALS" in os.environ)

try:
    client = genai.Client()
    resp = client.models.generate_content(model='gemini-2.5', contents='Say hello in one short sentence.')
    print('GENAI OK:', getattr(resp, 'text', str(resp))[:2000])
except Exception:
    print('GENAI ERROR:')
    traceback.print_exc()

