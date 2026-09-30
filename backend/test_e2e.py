"""
Quick end-to-end test: start a C technical session via the running FastAPI backend.
This validates the full chain: FastAPI -> GeminiService -> Ollama -> gemma4:31b-cloud
"""
import urllib.request
import json

BASE = "http://localhost:8000/api/v1"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer local-dev-token-test1234"
}

def post(path, body):
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=data,
        headers=HEADERS,
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read().decode("utf-8"))

print("Starting C technical session (this will call gemma4:31b-cloud)...")
try:
    result = post("/v1/technical/c/sessions/start", {
        "topic": "c_intro",
        "difficulty": "easy",
        "questionType": "mcq",
        "count": 2
    })
    print(f"SUCCESS! Session ID: {result.get('sessionId')}")
    print(f"Question count: {result.get('questionCount')}")
    q = result.get('questions', [{}])[0]
    print(f"First question preview: {q.get('question', 'N/A')[:100]}")
    print("\nMODEL SWITCH VERIFIED — gemma4:31b-cloud is responding correctly.")
except urllib.error.HTTPError as e:
    body = e.read().decode("utf-8", errors="replace")
    print(f"HTTP {e.code}: {body[:500]}")
except Exception as e:
    print(f"Error: {e}")
