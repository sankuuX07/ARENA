import os
import glob
import re

backend_dir = r"c:\Users\sansk\OneDrive\Desktop\ARENA\backend\app"

# 1. Update Services
services = [
    "technical_service.py",
    "c_service.py",
    "cpp_service.py",
    "cs_core_service.py",
    "java_service.py",
    "python_service.py"
]

for svc in services:
    path = os.path.join(backend_dir, "services", svc)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add TechnicalAnswerResponse to imports
    if "TechnicalAnswerResponse" not in content:
        content = re.sub(r'(from app\.schemas\.technical import \(\n.*?)(TechnicalResult)', r'\1TechnicalAnswerResponse, \2', content, flags=re.DOTALL)
        if "TechnicalAnswerResponse" not in content:
            # Fallback if the first regex didn't match
            content = content.replace("TechnicalResult,", "TechnicalAnswerResponse, TechnicalResult,")

    # Add submit_answer method
    submit_answer_code = """
    def submit_answer(self, uid: str, session_id: str, question_id: str, selected_option: int) -> TechnicalAnswerResponse:
        session = self.get_session(uid, session_id)
        if not session or session.status != "active":
            raise ValueError("Active session not found")
            
        for q in session.questions:
            if q.questionId == question_id:
                is_correct = (q.correctOption == selected_option)
                if is_correct:
                    session.score += 1
                return TechnicalAnswerResponse(
                    isCorrect=is_correct,
                    correctOption=q.correctOption,
                    explanation=q.explanation
                )
        raise ValueError("Question not found in session")
"""
    if "def submit_answer" not in content:
        content = content.replace("def complete_session", submit_answer_code.lstrip() + "\n    def complete_session")

    # Update complete_session signature and logic
    content = re.sub(r'def complete_session\(self, uid: str, session_id: str, final_score: int\) -> TechnicalResult:', r'def complete_session(self, uid: str, session_id: str) -> TechnicalResult:', content)
    
    # Remove final_score assignment, use session.score
    content = re.sub(r'session\.score = final_score\s+', r'', content)
    content = re.sub(r'final_score / session\.questionCount', r'session.score / session.questionCount', content)
    content = re.sub(r'score=final_score,', r'score=session.score,', content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
# 2. Update Endpoints
endpoints = [
    "technical.py",
    "technical_c.py",
    "technical_cpp.py",
    "technical_cs_core.py",
    "technical_java.py",
    "technical_python.py"
]

for ep in endpoints:
    path = os.path.join(backend_dir, "api", "v1", "endpoints", ep)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add Client schemas to imports
    if "ClientTechnicalSession" not in content:
        content = re.sub(r'(TechnicalSession,\s*TechnicalResult)', r'ClientTechnicalSession, \1', content)
        content = re.sub(r'(from app\.schemas\.technical import \(\n.*?)(TechnicalSession)', r'\1ClientTechnicalSession, ClientTechnicalQuestion, TechnicalAnswerRequest, TechnicalAnswerResponse, \2', content, flags=re.DOTALL)

    # Change return types of start_session and get_session to ClientTechnicalSession
    content = content.replace("response_model=TechnicalSession", "response_model=ClientTechnicalSession")

    # Add /sessions/{session_id}/answer endpoint
    if "def submit_answer" not in content:
        service_name = "technical_service"
        if ep == "technical_c.py": service_name = "c_service"
        elif ep == "technical_cpp.py": service_name = "cpp_service"
        elif ep == "technical_cs_core.py": service_name = "cs_core_service"
        elif ep == "technical_java.py": service_name = "java_service"
        elif ep == "technical_python.py": service_name = "python_service"
        
        answer_endpoint = f"""
@router.post("/sessions/{{session_id}}/answer", response_model=TechnicalAnswerResponse)
async def submit_answer(
    session_id: str,
    request: TechnicalAnswerRequest,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return {service_name}.submit_answer(uid, session_id, request.questionId, request.selectedOption)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""
        content = content.replace("@router.post(\"/sessions/{session_id}/complete", answer_endpoint.lstrip() + "\n@router.post(\"/sessions/{session_id}/complete")

    # Remove score from complete request
    content = re.sub(r'class \w+CompleteRequest\(BaseModel\):\n\s+score: int', r'class DummyCompleteRequest(BaseModel):\n    pass', content)
    content = re.sub(r'request: \w+CompleteRequest,', r'', content)
    content = re.sub(r'request\.score', r'', content)
    content = re.sub(r'complete_session\(uid, session_id, \)', r'complete_session(uid, session_id)', content)
    # Fix the trailing comma issue if any
    content = re.sub(r'complete_session\(uid, session_id, \)', r'complete_session(uid, session_id)', content)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Python refactoring complete.")
