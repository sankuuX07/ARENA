from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel

from app.schemas.resume_improvement import (
    ResumeImprovementSession, ResumeImprovementSuggestion,
    ResumeImprovementDraft, ResumeImprovementSummary,
    GenerateSuggestionRequest, EditSuggestionRequest
)
from app.services.resume_improvement_service import resume_improvement_service
from app.core.firebase_auth import verify_firebase_token
from app.core.rate_limiter import rate_limit_ai

router = APIRouter()

class CreateSessionRequest(BaseModel):
    resumeId: str
    screeningResultId: Optional[str] = None

@router.post("/analyze", response_model=ResumeImprovementSession, dependencies=[Depends(rate_limit_ai)])
async def analyze_resume(request: CreateSessionRequest, uid: str = Depends(verify_firebase_token)):
    try:
        return resume_improvement_service.create_session(uid, request.resumeId, request.screeningResultId)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create session")

@router.post("/sessions", response_model=ResumeImprovementSession)
async def create_session(request: CreateSessionRequest, uid: str = Depends(verify_firebase_token)):
    try:
        return resume_improvement_service.create_session(uid, request.resumeId, request.screeningResultId)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create session")

@router.get("/sessions", response_model=List[ResumeImprovementSession])
async def get_sessions(uid: str = Depends(verify_firebase_token)):
    return resume_improvement_service.get_user_sessions(uid)

@router.get("/sessions/{session_id}", response_model=ResumeImprovementSummary)
async def get_session_summary(session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return resume_improvement_service.get_session_summary(uid, session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/sessions/{session_id}/suggestions/generate", response_model=List[ResumeImprovementSuggestion])
async def generate_suggestions(session_id: str, request: GenerateSuggestionRequest, uid: str = Depends(verify_firebase_token)):
    try:
        return await resume_improvement_service.generate_suggestions(
            user_id=uid,
            session_id=session_id,
            section=request.section,
            context=request.context
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate AI suggestions")

@router.get("/sessions/{session_id}/suggestions", response_model=List[ResumeImprovementSuggestion])
async def get_suggestions(session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return resume_improvement_service.get_session_suggestions(uid, session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/suggestions/{suggestion_id}/accept", response_model=ResumeImprovementSuggestion)
async def accept_suggestion(suggestion_id: str, session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return resume_improvement_service.accept_suggestion(uid, session_id, suggestion_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/suggestions/{suggestion_id}/reject", response_model=ResumeImprovementSuggestion)
async def reject_suggestion(suggestion_id: str, session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return resume_improvement_service.reject_suggestion(uid, session_id, suggestion_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/suggestions/{suggestion_id}/edit", response_model=ResumeImprovementSuggestion)
async def edit_suggestion(suggestion_id: str, session_id: str, request: EditSuggestionRequest, uid: str = Depends(verify_firebase_token)):
    try:
        return resume_improvement_service.edit_suggestion(uid, session_id, suggestion_id, request.editedText)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/sessions/{session_id}/draft", response_model=ResumeImprovementDraft)
async def get_draft(session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return resume_improvement_service.get_session_draft(uid, session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
