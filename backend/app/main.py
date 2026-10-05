from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.core.security_middleware import SecurityMiddleware

import logging

# firebase_admin is optional in development. In production, set GOOGLE_APPLICATION_CREDENTIALS.
try:
    import firebase_admin
    try:
        firebase_admin.initialize_app()
        logging.info("Firebase Admin initialized successfully.")
    except ValueError:
        pass  # Already initialized
    except Exception as e:
        logging.warning(
            f"Firebase Admin init failed: {e}. "
            "Backend will use local-dev-token auth bypass in development mode."
        )
except ImportError:
    logging.warning(
        "firebase_admin not fully installed or missing google deps. "
        "Running in local-dev mode only. Install firebase-admin for production."
    )


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
