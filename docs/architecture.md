# ARENA Architecture Overview

## Monorepo Layout

ARENA is structured as a decoupled monorepo, keeping the frontend client and backend service independently deployable and scalable.

```
ARENA/
├── frontend/     # React + TypeScript SPA (Vite)
├── backend/      # Python FastAPI application
├── firebase/     # Firestore rules & indexes
└── docs/         # System architecture & guidelines
```

## System Layers

### 1. Frontend Client
- **Framework**: React.js with TypeScript & Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Modern Vanilla CSS with CSS custom properties (Design System)
- **Services**:
  - `api.ts`: Centralized HTTP client wrapping `fetch`
  - `healthService.ts`: Specialized endpoint service calls
  - `firebase.ts`: Firebase App, Auth, & Firestore initialization abstraction

### 2. Backend Service
- **Framework**: FastAPI (Python 3.10+)
- **ASGI Server**: Uvicorn
- **Configuration**: Pydantic BaseSettings loading from `.env`
- **Routing**: Modular APIRouter system (`app/api/v1/router.py`)
- **Validation**: Pydantic models for request & response schemas

### 3. Database & Authentication
- **Provider**: Firebase (Authentication + Cloud Firestore)
- **Security**: Environment-driven credential management without hardcoding keys.

## API Specification

### Health Check Endpoint
- **URL**: `/api/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "ARENA backend"
  }
  ```
