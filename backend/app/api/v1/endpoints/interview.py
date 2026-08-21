from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from datetime import datetime

from app.schemas.interview import (
    InterviewConfig, InterviewSession, InterviewResponseRequest,
    InterviewResponse, InterviewStatusResponse
)
from app.schemas.interview_evaluation import InterviewEvaluation, InterviewHistoryItem
from app.services.interview_service import interview_service
from app.services.interview_evaluation_service import interview_evaluation_service
from app.core.firebase_auth import verify_firebase_token
from app.core.rate_limiter import rate_limit_ai

router = APIRouter()

@router.get("/modes", response_model=List[Dict])
async def get_modes():
    return interview_service.get_modes()

@router.post("/sessions", response_model=InterviewSession)
async def start_session(config: InterviewConfig, uid: str = Depends(verify_firebase_token)):
    try:
        return await interview_service.start_session(uid, config)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}", response_model=InterviewSession)
async def get_session(session_id: str, uid: str = Depends(verify_firebase_token)):
    session = interview_service.get_session(uid, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions/{session_id}/respond", response_model=InterviewResponse, dependencies=[Depends(rate_limit_ai)])
async def respond(session_id: str, request: InterviewResponseRequest, uid: str = Depends(verify_firebase_token)):
    try:
        return await interview_service.respond(uid, session_id, request.content)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sessions/{session_id}/end", response_model=InterviewSession)
async def end_session(session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return interview_service.end_session(uid, session_id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}/status", response_model=InterviewStatusResponse)
async def get_status(session_id: str, uid: str = Depends(verify_firebase_token)):
    session = interview_service.get_session(uid, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return InterviewStatusResponse(
        status=session.status,
        startedAt=session.startedAt,
        expiresAt=session.expiresAt,
        serverTime=datetime.utcnow().isoformat() + "Z"
    )

# --- EVALUATION ROUTES ---

@router.post("/sessions/{session_id}/evaluate", response_model=InterviewEvaluation, dependencies=[Depends(rate_limit_ai)])
async def evaluate_session(session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return await interview_evaluation_service.evaluate_session(uid, session_id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results/{result_id}", response_model=InterviewEvaluation)
async def get_evaluation_result(result_id: str, uid: str = Depends(verify_firebase_token)):
    result = interview_evaluation_service.get_evaluation(uid, result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Evaluation result not found")
    return result

@router.get("/sessions/{session_id}/result", response_model=InterviewEvaluation)
async def get_session_result(session_id: str, uid: str = Depends(verify_firebase_token)):
    result = interview_evaluation_service.get_evaluation_by_session(uid, session_id)
    if not result:
        raise HTTPException(status_code=404, detail="Evaluation result not found for this session")
    return result

@router.get("/history", response_model=List[InterviewHistoryItem])
async def get_history(uid: str = Depends(verify_firebase_token)):
    try:
        evals = interview_evaluation_service.get_history(uid)
        return [
            InterviewHistoryItem(
                resultId=e.resultId,
                sessionId=e.sessionId,
                mode=e.mode,
                topic=e.topic,
                status=e.status,
                overallScore=e.overallScore,
                performanceLevel=e.performanceLevel,
                createdAt=e.createdAt
            ) for e in evals
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
