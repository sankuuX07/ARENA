import os
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import FileResponse
from typing import List

from app.schemas.resume import (
    ResumeUploadResponse, ResumeListItem, ResumeDetail, ResumeDeleteResponse
)
from app.services.resume_service import resume_service
from app.core.firebase_auth import verify_firebase_token
from app.config.security_config import security_config

router = APIRouter()

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...), uid: str = Depends(verify_firebase_token)):
    if file.size and file.size > security_config.MAX_RESUME_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large. Max size is 5MB.")
    if file.content_type not in security_config.ALLOWED_RESUME_MIME_TYPES:
        raise HTTPException(status_code=415, detail="Invalid file type. Only PDF and DOCX are allowed.")
    try:
        metadata = await resume_service.upload_resume(uid, file)
        return ResumeUploadResponse(
            message="Resume uploaded successfully",
            resume=metadata
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred during upload.")

@router.get("/", response_model=List[ResumeListItem])
async def list_resumes(uid: str = Depends(verify_firebase_token)):
    try:
        resumes = resume_service.get_user_resumes(uid)
        return [
            ResumeListItem(
                resumeId=r.resumeId,
                originalFileName=r.originalFileName,
                fileType=r.fileType,
                fileSize=r.fileSize,
                uploadedAt=r.uploadedAt,
                isActive=r.isActive,
                status=r.status.value
            ) for r in sorted(resumes, key=lambda x: x.uploadedAt, reverse=True)
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/active", response_model=ResumeDetail)
async def get_active_resume(uid: str = Depends(verify_firebase_token)):
    resume = resume_service.get_active_resume(uid)
    if not resume:
        raise HTTPException(status_code=404, detail="No active resume found.")
    return ResumeDetail(**resume.dict())

@router.get("/{resume_id}", response_model=ResumeDetail)
async def get_resume_details(resume_id: str, uid: str = Depends(verify_firebase_token)):
    resume = resume_service.get_resume(uid, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return ResumeDetail(**resume.dict())

@router.post("/{resume_id}/set-active", response_model=ResumeDetail)
async def set_active_resume(resume_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        resume = resume_service.set_active_resume(uid, resume_id)
        return ResumeDetail(**resume.dict())
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{resume_id}", response_model=ResumeDeleteResponse)
async def delete_resume(resume_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        resume_service.delete_resume(uid, resume_id)
        return ResumeDeleteResponse(message="Resume deleted successfully.")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{resume_id}/download")
async def download_resume(resume_id: str, uid: str = Depends(verify_firebase_token)):
    resume = resume_service.get_resume(uid, resume_id)
    if not resume or not os.path.exists(resume.storagePath):
        raise HTTPException(status_code=404, detail="Resume file not found.")
        
    return FileResponse(
        path=resume.storagePath,
        filename=resume.originalFileName,
        media_type=resume.fileType
    )
