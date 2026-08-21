import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.firebase_auth import verify_firebase_token
from app.core.authorization import verify_admin
from app.config.security_config import security_config

# Mock User IDs
MOCK_STUDENT_A = "student-a-uid"
MOCK_STUDENT_B = "student-b-uid"
MOCK_ADMIN = "mock-uid-admin"

def override_verify_token_student_a():
    return MOCK_STUDENT_A

def override_verify_token_student_b():
    return MOCK_STUDENT_B

def override_verify_token_admin():
    return MOCK_ADMIN

from fastapi import Request, HTTPException

def override_verify_token(request: Request):
    mock_uid = request.headers.get("X-Mock-Uid")
    if not mock_uid:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    return mock_uid

@pytest.fixture(autouse=True)
def _setup_overrides():
    app.dependency_overrides[verify_firebase_token] = override_verify_token
    yield
    app.dependency_overrides.clear()

@pytest.fixture
def client():
    # Unauthenticated
    return TestClient(app)

@pytest.fixture
def auth_client_student_a():
    client = TestClient(app)
    client.headers.update({"X-Mock-Uid": MOCK_STUDENT_A})
    return client

@pytest.fixture
def auth_client_student_b():
    client = TestClient(app)
    client.headers.update({"X-Mock-Uid": MOCK_STUDENT_B})
    return client

@pytest.fixture
def auth_client_admin():
    client = TestClient(app)
    client.headers.update({"X-Mock-Uid": MOCK_ADMIN})
    return client
