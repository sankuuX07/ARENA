import requests

url = "http://localhost:8000/api/v1/communication/chat"
headers = {
    "Authorization": "Bearer local-dev-token-test-uid",
    "Content-Type": "application/json"
}
payload = {
    "message": "Hello, how are you?",
    "mode": "general",
    "history": []
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
