import os
import uuid
import shutil
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import UploadFile

from app.schemas.resume import ResumeMetadata, ResumeStatus

# Maximum file size: 5MB
MAX_FILE_SIZE = 5 * 1024 * 1024
ALLOWED_EXTENSIONS = {'.pdf', '.docx'}
ALLOWED_MIME_TYPES = {'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads", "resumes")

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ResumeService:
    def __init__(self):
        # In-memory storage for metadata mapping resultId -> ResumeMetadata
        self._resumes: Dict[str, ResumeMetadata] = {}

    def get_user_resumes(self, user_id: str) -> List[ResumeMetadata]:
        return [r for r in self._resumes.values() if r.userId == user_id and r.status != ResumeStatus.deleted]

    def get_active_resume(self, user_id: str) -> Optional[ResumeMetadata]:
        for r in self.get_user_resumes(user_id):
            if r.isActive:
                return r
        return None

    def get_resume(self, user_id: str, resume_id: str) -> Optional[ResumeMetadata]:
        resume = self._resumes.get(resume_id)
        if resume and resume.userId == user_id and resume.status != ResumeStatus.deleted:
            return resume
        return None

    async def upload_resume(self, user_id: str, file: UploadFile) -> ResumeMetadata:
        # Validate file
        if not file.filename:
            raise ValueError("No filename provided.")
            
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise ValueError(f"Unsupported file extension: {ext}. Only PDF and DOCX are allowed.")
            
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise ValueError(f"Unsupported file type: {file.content_type}.")
            
        # Read content to check size
        content = await file.read()
        file_size = len(content)
        if file_size > MAX_FILE_SIZE:
            raise ValueError(f"File size exceeds 5MB limit. Uploaded size: {file_size / (1024*1024):.2f}MB")
            
        # Secure filename and storage
        resume_id = f"res_{uuid.uuid4().hex[:8]}"
        safe_filename = f"resume_{resume_id}{ext}"
        
        user_dir = os.path.join(UPLOAD_DIR, user_id)
        os.makedirs(user_dir, exist_ok=True)
        
        storage_path = os.path.join(user_dir, safe_filename)
        
        with open(storage_path, "wb") as f:
            f.write(content)
            
        # Check if first resume
        existing = self.get_user_resumes(user_id)
        is_first = len(existing) == 0
        
        now = datetime.utcnow().isoformat() + "Z"
        metadata = ResumeMetadata(
            resumeId=resume_id,
            userId=user_id,
            originalFileName=file.filename,
            storagePath=storage_path,
            fileType=file.content_type,
            fileExtension=ext.lstrip('.'),
            fileSize=file_size,
            uploadedAt=now,
            updatedAt=now,
            isActive=is_first,
            status=ResumeStatus.active
        )
        
        self._resumes[resume_id] = metadata
        return metadata

    def set_active_resume(self, user_id: str, resume_id: str) -> ResumeMetadata:
        target_resume = self.get_resume(user_id, resume_id)
        if not target_resume:
            raise ValueError("Resume not found.")
            
        # Deactivate all others
        for r in self.get_user_resumes(user_id):
            if r.isActive:
                r.isActive = False
                r.updatedAt = datetime.utcnow().isoformat() + "Z"
                
        # Activate target
        target_resume.isActive = True
        target_resume.updatedAt = datetime.utcnow().isoformat() + "Z"
        
        return target_resume

    def delete_resume(self, user_id: str, resume_id: str) -> None:
        target_resume = self.get_resume(user_id, resume_id)
        if not target_resume:
            raise ValueError("Resume not found.")
            
        target_resume.status = ResumeStatus.deleted
        target_resume.isActive = False
        target_resume.updatedAt = datetime.utcnow().isoformat() + "Z"
        
        # Safely remove file
        if os.path.exists(target_resume.storagePath):
            try:
                os.remove(target_resume.storagePath)
            except Exception as e:
                print(f"[ResumeService] Failed to delete file {target_resume.storagePath}: {e}")

resume_service = ResumeService()
