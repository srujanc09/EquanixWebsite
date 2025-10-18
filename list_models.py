# list_models.py
import traceback
from google import genai

print("Listing models available to the client...\n")

try:
    client = genai.Client()
    models = client.models.list()
    # models may be iterable; print each entry (name/id and repr)
    for m in models:
        # try a few common attribute names
        name = getattr(m, 'name', None) or getattr(m, 'model', None) or getattr(m, 'id', None)
        print("MODEL:", name or m)
except Exception:
    print("ERROR listing models:")
    traceback.print_exc()

    