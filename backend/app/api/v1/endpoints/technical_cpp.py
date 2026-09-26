from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.technical import (
    ClientTechnicalSession, ClientTechnicalQuestion, TechnicalAnswerRequest, TechnicalAnswerResponse, TechnicalSession, TechnicalResult,
    TechnicalLanguage, TechnicalDifficulty, TechnicalQuestionType, TechnicalModule, TechnicalTopic, CSSubject, CSTopic
)
from app.services.cpp_service import cpp_service
from app.core.firebase_auth import verify_firebase_token
from pydantic import BaseModel

router = APIRouter()

class CppSessionStartRequest(BaseModel):
    topic: str
    difficulty: TechnicalDifficulty
    questionType: TechnicalQuestionType
    count: int = 5

class DummyCompleteRequest(BaseModel):
    pass

@router.get("/topics", response_model=List[TechnicalTopic])
async def get_cpp_topics():
    return cpp_service.get_topics()

@router.get("/topics/{topic_id}", response_model=TechnicalTopic)
async def get_cpp_topic(topic_id: str):
    topic = cpp_service.get_topic(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

@router.post("/sessions/start", response_model=ClientTechnicalSession)
async def start_cpp_session(
    request: CppSessionStartRequest,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return await cpp_service.start_session(
            uid=uid,
            topic=request.topic,
            difficulty=request.difficulty,
            q_type=request.questionType,
            count=request.count
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}", response_model=ClientTechnicalSession)
async def get_cpp_session(
    session_id: str,
    uid: str = Depends(verify_firebase_token)
):
    session = cpp_service.get_session(uid, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions/{session_id}/answer", response_model=TechnicalAnswerResponse)
async def submit_answer(
    session_id: str,
    request: TechnicalAnswerRequest,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return cpp_service.submit_answer(uid, session_id, request.questionId, request.selectedOption)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sessions/{session_id}/complete", response_model=TechnicalResult)
async def complete_cpp_session(
    session_id: str,
    
    uid: str = Depends(verify_firebase_token)
):
    try:
        return cpp_service.complete_session(uid, session_id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
