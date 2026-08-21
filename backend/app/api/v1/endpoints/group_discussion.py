from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.schemas.group_discussion import (
    GroupDiscussionStartRequest,
    GroupDiscussionStartResponse,
    GroupDiscussionResponseRequest,
    GroupDiscussionResponseResponse,
    GroupDiscussionSessionSummary
)
from app.services.group_discussion_service import group_discussion_service
from pydantic import BaseModel

router = APIRouter()

@router.post("/start", response_model=GroupDiscussionStartResponse)
async def start_group_discussion(request: GroupDiscussionStartRequest):
    try:
        return await group_discussion_service.start_session(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class EvaluateTurnRequest(GroupDiscussionResponseRequest):
    topic: str

@router.post("/respond", response_model=GroupDiscussionResponseResponse)
async def respond_group_discussion(request: EvaluateTurnRequest):
    try:
        # Extract topic from the wrapper request
        return await group_discussion_service.evaluate_turn(request, request.topic)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CompleteSessionRequest(BaseModel):
    session_id: str
    topic: str
    category: str
    difficulty: str
    messages: List[Dict[str, Any]]

@router.post("/complete", response_model=GroupDiscussionSessionSummary)
async def complete_group_discussion(request: CompleteSessionRequest):
    try:
        return await group_discussion_service.complete_session(
            session_id=request.session_id,
            topic=request.topic,
            category=request.category,
            difficulty=request.difficulty,
            transcript_messages=request.messages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
