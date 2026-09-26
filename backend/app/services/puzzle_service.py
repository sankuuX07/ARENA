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
        from app.services.coding_evaluation_service import coding_evaluation_service
        from app.schemas.evaluation import CodingSubmissionRequest
        
        eval_req = CodingSubmissionRequest(
            problemId=request.problemId,
            language=request.language,
            code=request.code
        )
        eval_resp = coding_evaluation_service.evaluate_submission(request.uid, eval_req)
        
        return PuzzleSubmissionResponse(
            submissionId=eval_resp.submissionId,
            uid=request.uid,
            problemId=eval_resp.problemId,
            language=eval_resp.language,
            code=eval_resp.code if hasattr(eval_resp, 'code') else request.code,
            status=eval_resp.status,
            createdAt=eval_resp.submittedAt
        )

    def get_progress(self, uid: str) -> PuzzleProgress:
        from app.services.coding_evaluation_service import coding_evaluation_service
        history = coding_evaluation_service.get_submission_history(uid)
        attempted_problems = set(sub.problemId for sub in history)
        solved_problems = set(sub.problemId for sub in history if sub.status == 'accepted')
        
        easy_solved = 0
        medium_solved = 0
        hard_solved = 0
        
        for pid in solved_problems:
            prob = self.get_problem(pid)
            if prob:
                diff = prob.difficulty.lower()
                if diff == 'easy':
                    easy_solved += 1
                elif diff == 'medium':
                    medium_solved += 1
                elif diff == 'hard':
                    hard_solved += 1
                    
        accuracy = 0
        if len(history) > 0:
            accuracy = round((len([s for s in history if s.status == 'accepted']) / len(history)) * 100)

        return PuzzleProgress(
            uid=uid,
            problemsAttempted=len(attempted_problems),
            problemsSolved=len(solved_problems),
            accuracy=accuracy,
            easySolved=easy_solved,
            mediumSolved=medium_solved,
            hardSolved=hard_solved
        )

puzzle_service = PuzzleService()
