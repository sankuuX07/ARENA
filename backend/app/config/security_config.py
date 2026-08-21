import os
from typing import List

class SecurityConfig:
    # CORS
    ALLOWED_ORIGINS: List[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    
    # Uploads
    MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB
    ALLOWED_RESUME_MIME_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    
    # Rate Limiting
    # Simplistic configuration for demonstration. In production, use Redis or robust memory store.
    RATE_LIMIT_STANDARD = int(os.getenv("RATE_LIMIT_STANDARD", "100")) # requests per minute
    RATE_LIMIT_AI_GENERATION = int(os.getenv("RATE_LIMIT_AI_GENERATION", "10")) # requests per minute for expensive operations
    
    # Validation Limits
    MAX_TEXT_INPUT_LENGTH = 5000
    MAX_DISPLAY_NAME_LENGTH = 100
    
    # Admin Authorization
    # A list of UIDs that have administrative privileges. In a full system, this might be a Firestore collection.
    ADMIN_UIDS: List[str] = os.getenv("ADMIN_UIDS", "mock-uid-admin,admin-user-123").split(",")

security_config = SecurityConfig()
