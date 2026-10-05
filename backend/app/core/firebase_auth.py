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
        if settings.ENVIRONMENT == "production":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid authorization header.",
            )
        # In dev mode without a token, allow anonymous for health checks only
        return "student-authenticated-uid"

    token = authorization.split("Bearer ", 1)[1].strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Empty authorization token.",
        )

    # ── Development local-auth bypass ─────────────────────────────────────────
    # Frontend sends 'local-dev-token-{uid}' when VITE_AUTH_MODE=local.
    # This is ONLY accepted outside production.
    if settings.ENVIRONMENT != "production" and token.startswith("local-dev-token-"):
        uid = token[len("local-dev-token-"):]
        if uid:
            logger.debug(f"[Auth] Local-dev bypass accepted for uid={uid}")
            return uid
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid local dev token format — missing UID suffix.",
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
