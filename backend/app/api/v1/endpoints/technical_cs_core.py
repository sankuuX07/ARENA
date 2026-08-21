from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.technical import (
    CSSubject, CSTopic, TechnicalSession, TechnicalResult,
    TechnicalDifficulty, TechnicalQuestionType
)
from app.services.cs_core_service import cs_core_service
from app.core.firebase_auth import verify_firebase_token
from pydantic import BaseModel

router = APIRouter()

class CSCoreSessionStartRequest(BaseModel):
    subjectId: str
    topicId: str
    difficulty: TechnicalDifficulty
    questionType: TechnicalQuestionType
    count: int = 5

class CSCoreSessionCompleteRequest(BaseModel):
    score: int

@router.get("/subjects", response_model=List[CSSubject])
async def get_cs_core_subjects():
    return cs_core_service.get_subjects()

@router.get("/subjects/{subject_id}", response_model=CSSubject)
async def get_cs_core_subject(subject_id: str):
    subject = cs_core_service.get_subject(subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@router.get("/subjects/{subject_id}/topics", response_model=List[CSTopic])
async def get_cs_core_topics(subject_id: str):
    subject = cs_core_service.get_subject(subject_id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject.topics

@router.post("/sessions/start", response_model=TechnicalSession)
async def start_cs_core_session(
    request: CSCoreSessionStartRequest,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return await cs_core_service.start_session(
            uid=uid,
            subject_id=request.subjectId,
            topic_id=request.topicId,
            difficulty=request.difficulty,
            q_type=request.questionType,
            count=request.count
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}", response_model=TechnicalSession)
async def get_cs_core_session(
    session_id: str,
    uid: str = Depends(verify_firebase_token)
):
    session = cs_core_service.get_session(uid, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions/{session_id}/complete", response_model=TechnicalResult)
async def complete_cs_core_session(
    session_id: str,
    request: CSCoreSessionCompleteRequest,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return cs_core_service.complete_session(uid, session_id, request.score)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
