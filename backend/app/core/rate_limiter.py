import time
from typing import Dict, Tuple
from fastapi import HTTPException
from app.config.security_config import security_config

# A simple in-memory sliding window rate limiter
# In production with multiple workers, this should be backed by Redis.
class InMemoryRateLimiter:
    def __init__(self):
        # Key: (ip, route_type) -> Value: (timestamp_window_start, request_count)
        self.windows: Dict[Tuple[str, str], Tuple[float, int]] = {}

    def _check_limit(self, client_ip: str, limit: int, route_type: str = "standard"):
        now = time.time()
        key = (client_ip, route_type)
        
        window_start, count = self.windows.get(key, (now, 0))
        
        # Reset window after 60 seconds
        if now - window_start > 60:
            window_start = now
            count = 0
            
        count += 1
        self.windows[key] = (window_start, count)
        
        if count > limit:
            raise HTTPException(
                status_code=429, 
                detail="Too many requests. Please try again later."
            )

    def check_standard(self, client_ip: str):
        self._check_limit(client_ip, security_config.RATE_LIMIT_STANDARD, "standard")

    def check_ai_generation(self, client_ip: str):
        self._check_limit(client_ip, security_config.RATE_LIMIT_AI_GENERATION, "ai_generation")

rate_limiter = InMemoryRateLimiter()

# Dependencies for routes
from fastapi import Request

async def rate_limit_standard(request: Request):
    ip = request.client.host if request.client else "unknown"
    rate_limiter.check_standard(ip)
    
async def rate_limit_ai(request: Request):
    ip = request.client.host if request.client else "unknown"
    rate_limiter.check_ai_generation(ip)
