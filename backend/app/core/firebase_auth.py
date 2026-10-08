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

    In development (ENVIRONMENT != production), accepts local-dev-token-{uid} bypass.
    In production, requires a real Firebase ID token.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header.",
        )

    token = authorization.split("Bearer ", 1)[1].strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Empty authorization token.",
        )

    # ── Production Firebase token verification ────────────────────────────────
    try:
        from firebase_admin import auth
        decoded_token = auth.verify_id_token(token)
        return decoded_token["uid"]
    except ImportError:
        logger.error("[Auth] firebase_admin not installed — cannot verify real Firebase tokens.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Firebase authentication service is unavailable. "
                "Install firebase-admin and its dependencies, or use local dev mode."
            ),
        )
    except Exception as e:
        logger.warning(f"[Auth] Firebase token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
