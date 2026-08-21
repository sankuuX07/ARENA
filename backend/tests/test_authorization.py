from fastapi.testclient import TestClient

def test_admin_access_allowed(auth_client_admin: TestClient):
    """
    Test that an admin can access admin routes.
    """
    response = auth_client_admin.get("/api/v1/admin/dashboard")
    assert response.status_code == 200

def test_student_access_to_admin_denied(auth_client_student_a: TestClient):
    """
    Test that a standard student is forbidden from admin routes.
    """
    response = auth_client_student_a.get("/api/v1/admin/dashboard")
    assert response.status_code == 403
    assert "Forbidden" in response.json()["detail"] or "Restricted" in response.json()["detail"]

def test_idor_protection_resume_access(auth_client_student_a: TestClient, auth_client_student_b: TestClient):
    """
    Test IDOR protection. Student B cannot access Student A's resume.
    """
    # 1. Student A uploads a resume
    file_data = {"file": ("test.pdf", b"dummy content", "application/pdf")}
    response = auth_client_student_a.post("/api/v1/resumes/upload", files=file_data)
    assert response.status_code == 200
    resume_id = response.json()["resume"]["resumeId"]

    # 2. Student A can access it
    response_a = auth_client_student_a.get(f"/api/v1/resumes/{resume_id}")
    assert response_a.status_code == 200

    # 3. Student B cannot access it
    response_b = auth_client_student_b.get(f"/api/v1/resumes/{resume_id}")
    assert response_b.status_code in [403, 404]  # 403 Forbidden or 404 Not Found (safe)
