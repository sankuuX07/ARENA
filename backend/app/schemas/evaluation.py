from pydantic import BaseModel
from typing import Optional

class CodingSubmissionRequest(BaseModel):
    problemId: str
    language: str
    code: str

class CodingSubmissionResponse(BaseModel):
    submissionId: str
    problemId: str
    status: str
    language: str
    passedTests: int
    totalTests: int
    score: int
    executionTimeMs: int
    memoryUsage: str
    submittedAt: str
    isFirstSolve: bool
    errorMessage: Optional[str] = None
