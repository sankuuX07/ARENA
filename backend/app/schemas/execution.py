from pydantic import BaseModel
from typing import Optional

class CodeExecutionRequest(BaseModel):
    problemId: str
    language: str
    code: str
    stdin: Optional[str] = ""

class CodeExecutionResponse(BaseModel):
    executionId: str
    status: str
    stdout: str
    stderr: str
    executionTimeMs: int
    exitCode: int
