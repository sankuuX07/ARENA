from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.technical import (
    TechnicalTopic, TechnicalSession, TechnicalResult,
    TechnicalDifficulty, TechnicalQuestionType
)
from app.services.c_service import c_service
from app.core.firebase_auth import verify_firebase_token
from pydantic import BaseModel

router = APIRouter()

class CSessionStartRequest(BaseModel):
    topic: str
    difficulty: TechnicalDifficulty
    questionType: TechnicalQuestionType
    count: int = 5

class CSessionCompleteRequest(BaseModel):
    score: int

@router.get("/topics", response_model=List[TechnicalTopic])
async def get_c_topics():
    return c_service.get_topics()

@router.get("/topics/{topic_id}", response_model=TechnicalTopic)
async def get_c_topic(topic_id: str):
    topic = c_service.get_topic(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

@router.post("/sessions/start", response_model=TechnicalSession)
async def start_c_session(
    request: CSessionStartRequest,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return await c_service.start_session(
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

@router.get("/sessions/{session_id}", response_model=TechnicalSession)
async def get_c_session(
    session_id: str,
    uid: str = Depends(verify_firebase_token)
):
    session = c_service.get_session(uid, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions/{session_id}/complete", response_model=TechnicalResult)
async def complete_c_session(
    session_id: str,
    request: CSessionCompleteRequest,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return c_service.complete_session(uid, session_id, request.score)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
