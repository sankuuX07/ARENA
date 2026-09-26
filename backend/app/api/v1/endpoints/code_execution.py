from fastapi import APIRouter, HTTPException
from app.schemas.execution import CodeExecutionRequest, CodeExecutionResponse
from app.services.execution.execution_service import code_execution_service
from app.core.firebase_auth import verify_firebase_token
from fastapi import Depends

router = APIRouter()

@router.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(request: CodeExecutionRequest, token_uid: str = Depends(verify_firebase_token)):
    try:
        return code_execution_service.execute(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
