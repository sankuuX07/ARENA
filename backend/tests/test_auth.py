from fastapi.testclient import TestClient

def test_health_endpoint(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_unauthenticated_access_rejected(client: TestClient):
    """
    Test that an unauthenticated client cannot access protected endpoints.
    """
    # Protected Overview
    response = client.get("/api/v1/analytics/overview")
    assert response.status_code == 401

    # Protected Coding
    response = client.get("/api/v1/analytics/coding")
    assert response.status_code == 401
    
    # Protected Admin
    response = client.get("/api/v1/admin/dashboard")
    assert response.status_code == 401

def test_authenticated_student_access_allowed(auth_client_student_a: TestClient):
    """
    Test that an authenticated student can access their own endpoints.
    """
    response = auth_client_student_a.get("/api/v1/analytics/overview")
    # Might return 200 or 404, but not 401
    assert response.status_code in [200, 404] 
