from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.schemas.recommendation import (
    RecommendationOverview, StudentRecommendation, RecommendationHistoryItem
)
from app.services.recommendation_service import recommendation_service
from app.core.firebase_auth import verify_firebase_token

router = APIRouter()

@router.get("/overview", response_model=RecommendationOverview)
async def get_overview(uid: str = Depends(verify_firebase_token)):
    try:
        return recommendation_service.get_overview(uid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/active", response_model=List[StudentRecommendation])
async def get_active_recommendations(uid: str = Depends(verify_firebase_token)):
    try:
        overview = recommendation_service.get_overview(uid)
        return overview.activeRecommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/next-action", response_model=StudentRecommendation)
async def get_next_action(uid: str = Depends(verify_firebase_token)):
    try:
        overview = recommendation_service.get_overview(uid)
        if not overview.nextBestAction:
            raise HTTPException(status_code=404, detail="No active recommendations available.")
        return overview.nextBestAction
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh", response_model=RecommendationOverview)
async def refresh_recommendations(uid: str = Depends(verify_firebase_token)):
    try:
        return recommendation_service.refresh_recommendations(uid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[RecommendationHistoryItem])
async def get_recommendation_history(uid: str = Depends(verify_firebase_token)):
    try:
        return recommendation_service.get_history(uid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{recommendation_id}/complete", response_model=StudentRecommendation)
async def complete_recommendation(recommendation_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return recommendation_service.mark_completed(uid, recommendation_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{recommendation_id}/dismiss", response_model=StudentRecommendation)
async def dismiss_recommendation(recommendation_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return recommendation_service.dismiss(uid, recommendation_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
