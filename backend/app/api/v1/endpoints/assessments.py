from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from app.schemas.assessment import (
    Assessment, AssessmentSession, AssessmentAnswer, 
    AssessmentStatusResponse, AssessmentResult, QuestionResult
)
from app.services.assessment_service import assessment_service
from app.services.assessment_result_service import assessment_result_service
from app.core.firebase_auth import verify_firebase_token

router = APIRouter()

@router.get("/", response_model=List[Assessment])
async def get_assessments(uid: str = Depends(verify_firebase_token)):
    return assessment_service.get_assessments()

@router.get("/{assessment_id}", response_model=Assessment)
async def get_assessment(assessment_id: str, uid: str = Depends(verify_firebase_token)):
    assessment = assessment_service.get_assessment(assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@router.post("/{assessment_id}/sessions", response_model=AssessmentSession)
async def start_session(assessment_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return assessment_service.start_session(uid, assessment_id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}", response_model=AssessmentSession)
async def get_session(session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return assessment_service.get_session(uid, session_id)
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))

@router.post("/sessions/{session_id}/answers", response_model=AssessmentSession)
async def save_answer(
    session_id: str,
    answer: AssessmentAnswer,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return assessment_service.save_answer(uid, session_id, answer)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@router.post("/sessions/{session_id}/submit", response_model=AssessmentSession)
async def submit_session(
    session_id: str,
    uid: str = Depends(verify_firebase_token)
):
    try:
        res = assessment_service.submit_assessment(session_id, uid)
        if not res:
            raise ValueError("Session not found")
        return res
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@router.get("/sessions/{session_id}/status", response_model=AssessmentStatusResponse)
async def get_session_status(session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        session = assessment_service.get_session(uid, session_id)
        return AssessmentStatusResponse(
            status=session.status,
            startedAt=session.startedAt,
            expiresAt=session.expiresAt,
            serverTime=datetime.utcnow().isoformat() + "Z"
        )
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))

@router.get("/results/history", response_model=List[AssessmentResult])
async def get_history(uid: str = Depends(verify_firebase_token)):
    return assessment_result_service.get_history(uid)

@router.get("/results/{result_id}", response_model=AssessmentResult)
async def get_result(result_id: str, uid: str = Depends(verify_firebase_token)):
    res = assessment_result_service.get_result(result_id, uid)
    if not res:
        raise HTTPException(status_code=404, detail="Result not found")
    return res

@router.get("/results/{result_id}/review", response_model=List[QuestionResult])
async def get_result_review(result_id: str, uid: str = Depends(verify_firebase_token)):
    rev = assessment_result_service.get_review(result_id, uid)
    if rev is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return rev
