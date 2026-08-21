import uuid
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import traceback

logger = logging.getLogger(__name__)

class SecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Attach Request ID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        
        try:
            response = await call_next(request)
            
            # 2. Add Security Headers
            response.headers["X-Content-Type-Options"] = "nosniff"
            response.headers["X-Frame-Options"] = "DENY"
            response.headers["X-Request-ID"] = request_id
            
            # Basic CSP (Can be tightened for production)
            response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; object-src 'none';"
            
            return response
            
        except Exception as e:
            # 3. Sanitize Unhandled Errors
            # Log the full stack trace internally for debugging
            logger.error(f"Request ID: {request_id} - Unhandled Exception: {str(e)}\n{traceback.format_exc()}")
            
            # Return generic safe message to client
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal Server Error",
                    "request_id": request_id
                }
            )
