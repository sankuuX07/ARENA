from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.schemas.student_analytics import (
    AnalyticsOverview, AnalyticsActivity, CommunicationAnalytics,
    AptitudeAnalytics, CodingAnalytics, TechnicalAnalytics,
    AssessmentAnalytics, InterviewAnalytics, ResumeAnalytics
)
from app.services.student_analytics_service import student_analytics_service
from app.core.firebase_auth import verify_firebase_token

router = APIRouter()

@router.get("/overview", response_model=AnalyticsOverview)
async def get_overview(uid: str = Depends(verify_firebase_token)):
    try:
        return student_analytics_service.get_student_overview(uid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh", response_model=AnalyticsOverview)
async def refresh_analytics(uid: str = Depends(verify_firebase_token)):
    try:
        return student_analytics_service.get_student_overview(uid, force_refresh=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/communication", response_model=CommunicationAnalytics)
async def get_communication_analytics(uid: str = Depends(verify_firebase_token)):
    return student_analytics_service.get_communication_analytics(uid)

@router.get("/aptitude", response_model=AptitudeAnalytics)
async def get_aptitude_analytics(uid: str = Depends(verify_firebase_token)):
    return student_analytics_service.get_aptitude_analytics(uid)

@router.get("/coding", response_model=CodingAnalytics)
async def get_coding_analytics(uid: str = Depends(verify_firebase_token)):
    return student_analytics_service.get_coding_analytics(uid)

@router.get("/technical", response_model=TechnicalAnalytics)
async def get_technical_analytics(uid: str = Depends(verify_firebase_token)):
    return student_analytics_service.get_technical_analytics(uid)

@router.get("/assessments", response_model=AssessmentAnalytics)
async def get_assessment_analytics(uid: str = Depends(verify_firebase_token)):
    return student_analytics_service.get_assessment_analytics(uid)

@router.get("/interviews", response_model=InterviewAnalytics)
async def get_interview_analytics(uid: str = Depends(verify_firebase_token)):
    return student_analytics_service.get_interview_analytics(uid)

@router.get("/resume", response_model=ResumeAnalytics)
async def get_resume_analytics(uid: str = Depends(verify_firebase_token)):
    return student_analytics_service.get_resume_analytics(uid)

@router.get("/activity", response_model=List[AnalyticsActivity])
async def get_activity_timeline(uid: str = Depends(verify_firebase_token)):
    return student_analytics_service.get_activity_timeline(uid)
