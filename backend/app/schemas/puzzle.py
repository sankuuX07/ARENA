from pydantic import BaseModel
from typing import List, Optional, Dict

class PuzzleExample(BaseModel):
    input: str
    output: str
    explanation: Optional[str] = None

class PuzzleConstraint(BaseModel):
    value: str

class PuzzleProblem(BaseModel):
    problemId: str
    title: str
    slug: str
    difficulty: str
    category: str
    description: str
    constraints: List[PuzzleConstraint]
    inputFormat: str
    outputFormat: str
    examples: List[PuzzleExample]
    supportedLanguages: List[str]
    status: str
    sourceType: str
    tags: Optional[List[str]] = None
    expectedComplexity: Optional[Dict[str, str]] = None
    functionSignature: Optional[Dict[str, str]] = None

class ProblemGenerationRequest(BaseModel):
    category: str
    difficulty: str
    problemType: str
    language: str
    topic: Optional[str] = None

class PuzzleSubmissionRequest(BaseModel):
    uid: str
    problemId: str
    language: str
    code: str

class PuzzleSubmissionResponse(BaseModel):
    submissionId: str
    uid: str
    problemId: str
    language: str
    code: str
    status: str
    createdAt: str

class PuzzleProgress(BaseModel):
    uid: str
    problemsAttempted: int
    problemsSolved: int
    accuracy: int
    easySolved: int
    mediumSolved: int
    hardSolved: int
