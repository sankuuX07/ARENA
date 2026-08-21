from fastapi import HTTPException, Depends, status
from app.core.firebase_auth import verify_firebase_token
from app.config.security_config import security_config

def verify_ownership(resource_user_id: str, current_user_id: str):
    """
    Validates that the authenticated user owns the resource being requested.
    Raises 403 Forbidden to prevent IDOR attacks.
    """
    if resource_user_id != current_user_id:
        raise HTTPException(
            status_code=403, 
            detail="Forbidden: You do not have permission to access this resource."
        )

def require_role(current_role: str, allowed_roles: list[str]):
    """
    Validates that the user has a sufficient role.
    Foundation for M40 Admin checks.
    """
    if current_role not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Insufficient permissions."
        )

def verify_admin(uid: str = Depends(verify_firebase_token)) -> str:
    """
    Validates that the authenticated user is an administrator.
    This acts as a secure backend barrier for M40 routes.
    """
    if uid not in security_config.ADMIN_UIDS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Restricted: You do not have administrator privileges."
        )
    return uid
