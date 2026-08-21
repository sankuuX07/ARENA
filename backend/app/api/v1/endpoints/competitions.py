from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List

from app.schemas.competition import (
    Competition, CompetitionSession, CompetitionResult, 
    CompetitionLeaderboardResponse, CompetitionHistoryItem, CompetitionStatus
)
from app.services.competition_service import competition_service
from app.services.competition_session_service import competition_session_service
from app.services.competition_scoring_service import competition_scoring_service
from app.services.competition_leaderboard_service import competition_leaderboard_service
from app.core.firebase_auth import verify_firebase_token

router = APIRouter()

@router.get("/", response_model=List[Competition])
async def get_all_competitions(uid: str = Depends(verify_firebase_token)):
    return competition_service.get_competitions()

@router.get("/live", response_model=List[Competition])
async def get_live_competitions(uid: str = Depends(verify_firebase_token)):
    return competition_service.get_competitions(status=CompetitionStatus.live)

@router.get("/upcoming", response_model=List[Competition])
async def get_upcoming_competitions(uid: str = Depends(verify_firebase_token)):
    return competition_service.get_competitions(status=CompetitionStatus.upcoming)

@router.get("/history", response_model=List[CompetitionHistoryItem])
async def get_competition_history(uid: str = Depends(verify_firebase_token)):
    return competition_service.get_user_history(uid)

@router.get("/{competition_id}", response_model=Competition)
async def get_competition(competition_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return competition_service.get_competition(competition_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{competition_id}/register")
async def register_competition(competition_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return competition_service.register_participant(competition_id, uid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{competition_id}/start", response_model=CompetitionSession)
async def start_competition(competition_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return competition_session_service.start_session(competition_id, uid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{competition_id}/session", response_model=CompetitionSession)
async def get_competition_session(competition_id: str, uid: str = Depends(verify_firebase_token)):
    session = competition_session_service.get_session(competition_id, uid)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.patch("/{competition_id}/session", response_model=CompetitionSession)
async def update_competition_session(competition_id: str, answers: dict = Body(...), uid: str = Depends(verify_firebase_token)):
    try:
        return competition_session_service.update_session(competition_id, uid, answers)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{competition_id}/submit", response_model=CompetitionResult)
async def submit_competition(competition_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return competition_scoring_service.submit_competition(competition_id, uid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{competition_id}/result", response_model=CompetitionResult)
async def get_competition_result(competition_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return competition_scoring_service.get_result(competition_id, uid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{competition_id}/leaderboard", response_model=CompetitionLeaderboardResponse)
async def get_competition_leaderboard(competition_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return competition_leaderboard_service.get_leaderboard(competition_id, uid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
