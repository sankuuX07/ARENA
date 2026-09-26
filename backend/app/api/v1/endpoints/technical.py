from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.technical import (
    ClientTechnicalSession, ClientTechnicalQuestion, TechnicalAnswerRequest, TechnicalAnswerResponse, TechnicalSession, TechnicalResult,
    TechnicalLanguage, TechnicalDifficulty, TechnicalQuestionType, TechnicalModule, TechnicalTopic, CSSubject, CSTopic
)
from app.services.technical_service import technical_service
from app.core.firebase_auth import verify_firebase_token
from pydantic import BaseModel

router = APIRouter()

class SessionStartRequest(BaseModel):
    language: TechnicalLanguage
    topic: str
    difficulty: TechnicalDifficulty
    count: int = 5

class DummyCompleteRequest(BaseModel):
    pass

@router.get("/modules", response_model=List[TechnicalModule])
async def get_modules():
    try:
        return technical_service.get_modules()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/modules/{module_id}", response_model=TechnicalModule)
async def get_module(module_id: str):
    module = technical_service.get_module(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@router.post("/sessions/start", response_model=ClientTechnicalSession)
async def start_session(
    request: SessionStartRequest,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return await technical_service.start_session(
            uid=uid,
            language=request.language,
            topic=request.topic,
            difficulty=request.difficulty,
            count=request.count
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}", response_model=ClientTechnicalSession)
async def get_session(
    session_id: str,
    uid: str = Depends(verify_firebase_token)
):
    session = technical_service.get_session(uid, session_id)
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
        return technical_service.submit_answer(uid, session_id, request.questionId, request.selectedOption)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sessions/{session_id}/complete", response_model=TechnicalResult)
async def complete_session(
    session_id: str,
    
    uid: str = Depends(verify_firebase_token)
):
    try:
        return technical_service.complete_session(uid, session_id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
