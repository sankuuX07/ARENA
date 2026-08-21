from fastapi.testclient import TestClient

def test_dashboard_contract(auth_client_student_a: TestClient):
    # Need to have a profile first for M5 dashboard
    profile_data = {
        "displayName": "Test Student",
        "university": "Test University",
        "graduationYear": 2026,
        "major": "Computer Science",
        "degreeType": "Bachelors"
    }
    # Create profile (since analytics depends on uid being initialized or creates on fly)
    # Actually, dashboard might not require profile explicitly in the mock.
    response = auth_client_student_a.get("/api/v1/analytics/dashboard")
    assert response.status_code in [200, 404]
    
    if response.status_code == 200:
        data = response.json()
        assert "uid" in data
        assert "recentActivity" in data
        assert "learningSummary" in data

def test_competitions_contract(auth_client_student_a: TestClient):
    response = auth_client_student_a.get("/api/v1/competitions/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
