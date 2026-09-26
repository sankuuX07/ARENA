from fastapi import APIRouter, HTTPException
from app.schemas.aptitude import (
    AptitudeStartRequest,
    AptitudeStartResponse,
    AptitudeSessionCompleteRequest,
    AptitudeSessionSummary
)
from app.schemas.verbal import (
    VerbalStartRequest,
    VerbalStartResponse,
    VerbalSessionCompleteRequest,
    VerbalSessionSummary
)
from app.schemas.logical import (
    LogicalStartRequest,
    LogicalStartResponse,
    LogicalSessionCompleteRequest,
    LogicalSessionSummary
)
from app.services.aptitude_service import aptitude_service
from app.services.verbal_service import verbal_service
from app.services.logical_reasoning_service import logical_reasoning_service

router = APIRouter()

from app.core.firebase_auth import verify_firebase_token
from fastapi import Depends

@router.post("/start", response_model=AptitudeStartResponse)
async def start_aptitude_session(
    request: AptitudeStartRequest,
    student_uid: str = Depends(verify_firebase_token)
):
    if request.uid != student_uid:
        raise HTTPException(status_code=403, detail="Not authorized for this user")
    try:
        return await aptitude_service.start_session(request)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/complete", response_model=AptitudeSessionSummary)
async def complete_aptitude_session(
    request: AptitudeSessionCompleteRequest,
    student_uid: str = Depends(verify_firebase_token)
):
    if request.uid != student_uid:
        raise HTTPException(status_code=403, detail="Not authorized for this user")
    try:
        return await aptitude_service.complete_session(request)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verbal/start", response_model=VerbalStartResponse)
async def start_verbal_session(
    request: VerbalStartRequest,
    student_uid: str = Depends(verify_firebase_token)
):
    if request.uid != student_uid:
        raise HTTPException(status_code=403, detail="Not authorized for this user")
    try:
        return await verbal_service.start_session(request)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verbal/complete", response_model=VerbalSessionSummary)
async def complete_verbal_session(
    request: VerbalSessionCompleteRequest,
    student_uid: str = Depends(verify_firebase_token)
):
    if request.uid != student_uid:
        raise HTTPException(status_code=403, detail="Not authorized for this user")
    try:
        return await verbal_service.complete_session(request)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logical/start", response_model=LogicalStartResponse)
async def start_logical_session(
    request: LogicalStartRequest,
    student_uid: str = Depends(verify_firebase_token)
):
    if request.uid != student_uid:
        raise HTTPException(status_code=403, detail="Not authorized for this user")
    try:
        return await logical_reasoning_service.start_session(request)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logical/complete", response_model=LogicalSessionSummary)
async def complete_logical_session(
    request: LogicalSessionCompleteRequest,
    student_uid: str = Depends(verify_firebase_token)
):
    if request.uid != student_uid:
        raise HTTPException(status_code=403, detail="Not authorized for this user")
    try:
        return await logical_reasoning_service.complete_session(request)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
