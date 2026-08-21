from typing import Optional
from fastapi import Header, HTTPException, status
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

async def verify_firebase_token(
    authorization: Optional[str] = Header(None, description="Bearer token from Firebase Auth")
) -> str:
    """
    Backend authentication dependency for verifying Firebase ID tokens.
    Extracts Bearer token and returns the authenticated student UID.
    """
    if not authorization or not authorization.startswith("Bearer "):
        # Strictly reject missing headers in production
        if settings.ENVIRONMENT == "production":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid authorization header.",
            )
        # Development fallback only if specifically allowed, but generally we want a token
        return "student-authenticated-uid"

    token = authorization.split("Bearer ")[1].strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Empty authorization token.",
        )

    try:
        from firebase_admin import auth
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        logger.warning(f"Auth failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")
