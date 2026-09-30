"""
Direct test of gemma4:31b-cloud via Ollama API.
Tests both plain text and JSON-structured responses.
"""
import urllib.request
import json
import sys

BASE = "http://localhost:11434"

def chat(prompt, system=None):
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    
    payload = json.dumps({
        "model": "gemma4:31b-cloud",
        "messages": messages,
        "stream": False,
        "options": {"temperature": 0.7, "num_predict": 512}
    }).encode("utf-8")

    req = urllib.request.Request(
        f"{BASE}/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = json.loads(r.read().decode("utf-8"))
            return data.get("message", {}).get("content", "").strip()
    except Exception as e:
        return f"ERROR: {e}"

# Test 1: simple hello
print("=== TEST 1: Simple hello ===")
r1 = chat("Say hello in one sentence.")
print(repr(r1[:200]))

# Test 2: JSON array
print("\n=== TEST 2: JSON array ===")
r2 = chat(
    'Return ONLY a valid JSON array (no markdown, no code fences): [{"id": 1, "value": "test"}]',
    system="You are a JSON generator. Return only raw JSON, no markdown, no explanation."
)
print(repr(r2[:400]))

# Test 3: try to parse as JSON
print("\n=== TEST 3: Parse attempt ===")
try:
    parsed = json.loads(r2)
    print(f"Parsed OK: {type(parsed)}")
except json.JSONDecodeError as e:
    print(f"JSON parse failed: {e}")
    # Check if wrapped in markdown fences
    import re
    match = re.search(r'```(?:json)?\s*([\s\S]*?)```', r2)
    if match:
        inner = match.group(1).strip()
        print(f"Found markdown fence, inner: {repr(inner[:200])}")
        try:
            parsed = json.loads(inner)
            print(f"Parsed inner OK: {type(parsed)}")
        except Exception as e2:
            print(f"Inner parse also failed: {e2}")
    else:
        # Try find first [ or {
        start_bracket = min(
            (r2.find('[') if r2.find('[') >= 0 else 9999),
            (r2.find('{') if r2.find('{') >= 0 else 9999)
        )
        if start_bracket < 9999:
            end = r2.rfind(']') if '[' in r2 else r2.rfind('}')
            candidate = r2[start_bracket:end+1]
            print(f"Candidate: {repr(candidate[:200])}")
            try:
                parsed = json.loads(candidate)
                print(f"Candidate parsed OK: {type(parsed)}")
            except Exception as e3:
                print(f"Candidate parse failed: {e3}")
