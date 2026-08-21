from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime

class ResumeStatus(str, Enum):
    active = "active"
    archived = "archived"
    deleted = "deleted"

class ResumeMetadata(BaseModel):
    resumeId: str
    userId: str
    originalFileName: str
    storagePath: str
    fileType: str
    fileExtension: str
    fileSize: int
    uploadedAt: str
    updatedAt: str
    isActive: bool
    status: ResumeStatus
    analysisStatus: str = "not_analyzed"

class ResumeUploadResponse(BaseModel):
    message: str
    resume: ResumeMetadata

class ResumeListItem(BaseModel):
    resumeId: str
    originalFileName: str
    fileType: str
    fileSize: int
    uploadedAt: str
    isActive: bool
    status: str

class ResumeDetail(BaseModel):
    resumeId: str
    userId: str
    originalFileName: str
    fileType: str
    fileExtension: str
    fileSize: int
    uploadedAt: str
    updatedAt: str
    isActive: bool
    status: str
    analysisStatus: str

class ResumeDeleteResponse(BaseModel):
    message: str
