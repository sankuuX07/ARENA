import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import json
from app.schemas.interview import InterviewConfig

def test_communication_flow_success(auth_client_student_a):
    with patch('app.services.gemini_service.gemini_service.generate_communication_response', new_callable=AsyncMock) as mock_gemini:
        mock_gemini.return_value = "This is a mocked AI response."
        
        response = auth_client_student_a.post("/api/v1/communication/chat", json={
            "session_id": "test_session",
            "message": "Hello, this is a test message.",
            "mode": "general",
            "history": []
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "This is a mocked AI response."
        assert data["status"] == "success"

def test_communication_unauthorized(client):
    response = client.post("/api/v1/communication/chat", json={
        "session_id": "test_session",
        "message": "Hello",
        "mode": "general"
    })
    assert response.status_code == 401

def test_communication_invalid_input(auth_client_student_a):
    response = auth_client_student_a.post("/api/v1/communication/chat", json={
        "session_id": "test_session",
        "message": "",
        "mode": "general"
    })
    # Empty message should be 422 because of min_length=1 in pydantic
    assert response.status_code == 422
    
def test_communication_large_input(auth_client_student_a):
    large_message = "A" * 2001
    response = auth_client_student_a.post("/api/v1/communication/chat", json={
        "session_id": "test_session",
        "message": large_message,
        "mode": "general"
    })
    # max_length=2000
    assert response.status_code == 422

def test_interview_flow_success(auth_client_student_a):
    with patch('app.services.gemini_service.gemini_service.model_name', 'test-model'), \
         patch('google.generativeai.GenerativeModel') as MockModel, \
         patch('google.generativeai.configure'):
        
        # We need to test the fallback or gemini_service directly?
        # Actually interview_service directly uses gemini via start_chat.
        # Let's mock _generate_ai_response in interview_service to simplify.
        with patch('app.services.interview_service.interview_service._generate_ai_response', new_callable=AsyncMock) as mock_ai:
            mock_ai.return_value = "Mocked AI Interview Question"
            
            # Start Interview
            start_resp = auth_client_student_a.post("/api/v1/interviews/sessions", json={
                "mode": "technical",
                "difficulty": "medium",
                "durationMinutes": 30,
                "maxQuestions": 5,
                "responseMode": "text"
            })
            
            assert start_resp.status_code == 200
            session_data = start_resp.json()
            session_id = session_data["sessionId"]
            assert session_data["status"] == "in_progress"
            
            # Respond to Interview
            mock_ai.return_value = "Mocked AI Follow-up Question"
            respond_resp = auth_client_student_a.post(f"/api/v1/interviews/sessions/{session_id}/respond", json={
                "responseMode": "text",
                "content": "This is my answer."
            })
            
            assert respond_resp.status_code == 200
            assert respond_resp.json()["interviewerMessage"]["content"] == "Mocked AI Follow-up Question"

def test_interview_unauthorized_access(auth_client_student_a, auth_client_student_b):
    with patch('app.services.interview_service.interview_service._generate_ai_response', new_callable=AsyncMock) as mock_ai:
        mock_ai.return_value = "Mocked Response"
        
        # Student A starts interview
        start_resp = auth_client_student_a.post("/api/v1/interviews/sessions", json={
            "mode": "technical",
            "difficulty": "medium",
            "durationMinutes": 30,
            "maxQuestions": 5,
            "responseMode": "text"
        })
        session_id = start_resp.json()["sessionId"]
        
        # Student B tries to access Student A's session
        get_resp = auth_client_student_b.get(f"/api/v1/interviews/sessions/{session_id}")
        assert get_resp.status_code == 404

def test_interview_evaluation_success(auth_client_student_a):
    with patch('app.services.interview_service.interview_service._generate_ai_response', new_callable=AsyncMock) as mock_ai:
        mock_ai.return_value = "Mocked Response"
        
        start_resp = auth_client_student_a.post("/api/v1/interviews/sessions", json={
            "mode": "technical",
            "difficulty": "medium",
            "durationMinutes": 30,
            "maxQuestions": 1,
            "responseMode": "text"
        })
        session_id = start_resp.json()["sessionId"]
        
        # Respond to get more than 1 message
        auth_client_student_a.post(f"/api/v1/interviews/sessions/{session_id}/respond", json={
            "responseMode": "text",
            "content": "This is my answer to pass the 2 message minimum."
        })
        
        # End Session
        auth_client_student_a.post(f"/api/v1/interviews/sessions/{session_id}/end")
        
        # Mock Evaluation AI
        with patch('app.services.gemini_service.gemini_service.generate_json_response', new_callable=AsyncMock) as mock_json_ai:
            mock_json_ai.return_value = json.dumps({
                "overallScore": 85,
                "communicationScore": 80,
                "technicalScore": 90,
                "relevanceScore": 85,
                "clarityScore": 85,
                "structureScore": 85,
                "strengths": ["Good technical knowledge"],
                "improvementAreas": ["Needs more detail"],
                "questionEvaluations": [],
                "summary": "Solid performance.",
                "practiceAreas": []
            })
            
            eval_resp = auth_client_student_a.post(f"/api/v1/interviews/sessions/{session_id}/evaluate")
            assert eval_resp.status_code == 200
            assert eval_resp.json()["overallScore"] == 85
