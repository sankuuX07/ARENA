import uuid
from datetime import datetime
from typing import List, Optional
from app.schemas.puzzle import (
    PuzzleProblem,
    PuzzleConstraint,
    PuzzleExample,
    PuzzleSubmissionRequest,
    PuzzleSubmissionResponse,
    PuzzleProgress
)

# Demo problem for Milestone 17 Foundation
DEMO_PROBLEM = PuzzleProblem(
    problemId="demo-two-sum",
    title="Two Sum",
    slug="two-sum",
    difficulty="easy",
    category="Arrays",
    description="Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints=[
        PuzzleConstraint(value="2 <= nums.length <= 10^4"),
        PuzzleConstraint(value="-10^9 <= nums[i] <= 10^9"),
        PuzzleConstraint(value="-10^9 <= target <= 10^9"),
        PuzzleConstraint(value="Only one valid answer exists.")
    ],
    inputFormat="nums = [2,7,11,15]\ntarget = 9",
    outputFormat="[0,1]",
    examples=[
        PuzzleExample(
            input="nums = [2,7,11,15], target = 9",
            output="[0,1]",
            explanation="Because nums[0] + nums[1] == 9, we return [0, 1]."
        ),
        PuzzleExample(
            input="nums = [3,2,4], target = 6",
            output="[1,2]",
            explanation="nums[1] + nums[2] == 6, we return [1, 2]."
        )
    ],
    supportedLanguages=["python", "java", "cpp", "c"],
    status="published",
    sourceType="foundation_demo"
)

class PuzzleService:
    def __init__(self):
        self._problems: List[PuzzleProblem] = [DEMO_PROBLEM]

    def get_all_problems(self) -> List[PuzzleProblem]:
        return self._problems

    def get_problem(self, problem_id: str) -> Optional[PuzzleProblem]:
        for p in self._problems:
            if p.problemId == problem_id:
                return p
        return None
        
    def add_problem(self, problem: PuzzleProblem):
        self._problems.append(problem)

    def submit_solution(self, request: PuzzleSubmissionRequest) -> PuzzleSubmissionResponse:
        # Fake submission for Milestone 17. 
        # Code execution and evaluation will be in Milestone 19.
        submission_id = f"sub_{uuid.uuid4().hex[:10]}"
        return PuzzleSubmissionResponse(
            submissionId=submission_id,
            uid=request.uid,
            problemId=request.problemId,
            language=request.language,
            code=request.code,
            status="pending", # Strictly keeping it pending since we aren't executing it.
            createdAt=datetime.utcnow().isoformat() + "Z"
        )

    def get_progress(self, uid: str) -> PuzzleProgress:
        # Return a foundational empty progress object.
        # This will be populated from Firestore in future milestones.
        return PuzzleProgress(
            uid=uid,
            problemsAttempted=0,
            problemsSolved=0,
            accuracy=0,
            easySolved=0,
            mediumSolved=0,
            hardSolved=0
        )

puzzle_service = PuzzleService()
