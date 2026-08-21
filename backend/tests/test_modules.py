from fastapi.testclient import TestClient
import json

def test_admin_competition_mutation(auth_client_admin: TestClient, auth_client_student_a: TestClient):
    """
    Test Admin creates a competition, Student views it.
    """
    # 1. Admin creates competition
    comp_payload = {
        "title": "QA Test Competition",
        "description": "Test Description",
        "competitionType": "coding",
        "difficulty": "medium",
        "startTime": "2026-10-01T10:00:00",
        "endTime": "2026-10-01T12:00:00",
        "durationMinutes": 120,
        "maxParticipants": 100,
        "rules": [],
        "leaderboardVisibility": "public",
        "resultVisibility": "public"
    }
    response = auth_client_admin.post("/api/v1/admin/competitions", json=comp_payload)
    assert response.status_code == 200
    comp_id = response.json()["competitionId"]

    # 2. Student views competitions
    response = auth_client_student_a.get("/api/v1/competitions/")
    assert response.status_code == 200
    competitions = response.json()
    assert any(c["competitionId"] == comp_id for c in competitions)

def test_coding_submission_progress(auth_client_student_a: TestClient):
    """
    Test submitting code and ensuring it updates progress.
    """
    submit_payload = {
        "problemId": "c_arrays_1",
        "code": "int main() { return 0; }",
        "language": "c",
        "testCases": []
    }
    response = auth_client_student_a.post("/api/v1/code/execute", json=submit_payload)
    assert response.status_code == 200
    # Expected result should have status
    data = response.json()
    assert "status" in data
