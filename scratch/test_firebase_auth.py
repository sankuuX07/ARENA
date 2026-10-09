import requests
import json
import sys

API_KEY = "AIzaSyBwOUdkBRdfqN_506GzdV_2k2gDTwvM"

def signup(email, password):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={API_KEY}"
    res = requests.post(url, json={"email": email, "password": password, "returnSecureToken": True})
    return res.json()

def login(email, password):
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
    res = requests.post(url, json={"email": email, "password": password, "returnSecureToken": True})
    return res.json()

if __name__ == "__main__":
    email = "testrealuser@example.com"
    password = "Password123!"
    print("Signing up...")
    res = signup(email, password)
    print(res)
    if "error" in res and res["error"]["message"] == "EMAIL_EXISTS":
        pass
    print("Logging in...")
    login_res = login(email, password)
    print(login_res)
    
    if "idToken" in login_res:
        token = login_res["idToken"]
        print("Got token. Testing backend...")
        backend_res = requests.get("http://localhost:8000/api/v1/placement/history", headers={"Authorization": f"Bearer {token}"})
        print("Backend response:", backend_res.status_code, backend_res.text)
