from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.core.security_middleware import SecurityMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ARENA - Student Competitive Learning and Placement-Preparation Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for development and production
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Add Security Middleware
app.add_middleware(SecurityMiddleware)

# Include API Router under /api prefix
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {
        "message": "Welcome to ARENA API",
        "docs": "/docs",
        "health": "/api/health",
    }
