import uuid
import time
from datetime import datetime
from typing import Dict, List, Any
from app.schemas.evaluation import CodingSubmissionRequest, CodingSubmissionResponse
from app.schemas.execution import CodeExecutionRequest
from app.services.execution.execution_service import code_execution_service
from app.services.output_comparator import output_comparator
from app.services.puzzle_service import puzzle_service

# Mock Hidden Test Cases for the Demo Problem (Two Sum)
MOCK_TEST_CASES = {
    "demo-two-sum": [
        {"input": "nums = [2,7,11,15]\ntarget = 9", "expectedOutput": "[0,1]"},
        {"input": "nums = [3,2,4]\ntarget = 6", "expectedOutput": "[1,2]"},
        {"input": "nums = [3,3]\ntarget = 6", "expectedOutput": "[0,1]"}
    ]
}

class CodingEvaluationService:
    def __init__(self):
        # In-Memory authoritative data store
        # Map: uid -> List[CodingSubmissionResponse]
        self._submission_history: Dict[str, List[CodingSubmissionResponse]] = {}
        # Map: uid -> Set[problemId]
        self._solved_problems: Dict[str, set] = {}

    def get_submission_history(self, uid: str) -> List[CodingSubmissionResponse]:
        return sorted(self._submission_history.get(uid, []), key=lambda x: x.submittedAt, reverse=True)
        
    def get_problem_submissions(self, uid: str, problem_id: str) -> List[CodingSubmissionResponse]:
        history = self.get_submission_history(uid)
        return [sub for sub in history if sub.problemId == problem_id]

    def evaluate_submission(self, uid: str, request: CodingSubmissionRequest) -> CodingSubmissionResponse:
        problem = puzzle_service.get_problem(request.problemId)
        if not problem:
            raise ValueError(f"Problem {request.problemId} not found.")

        # If it's the AI generated problem, it won't have hidden test cases right now. 
        # Fallback to its public examples as the hidden test cases for demonstration.
        test_cases = MOCK_TEST_CASES.get(request.problemId)
        if not test_cases:
            if problem.examples:
                test_cases = [{"input": ex.input, "expectedOutput": ex.output} for ex in problem.examples]
            else:
                raise ValueError("No official test cases found for this problem.")

        total_tests = len(test_cases)
        passed_tests = 0
        total_time = 0
        status = "accepted"
        error_msg = None

        # Execute tests sequentially
        for idx, tc in enumerate(test_cases):
            exec_request = CodeExecutionRequest(
                problemId=request.problemId,
                language=request.language,
                code=request.code,
                stdin=tc["input"]
            )
            
            exec_result = code_execution_service.execute(exec_request)
            total_time += exec_result.executionTimeMs

            # Map Execution Status
            if exec_result.status == "system_error":
                # Check for specific Docker sandbox failsafe
                if "Secure code execution requires the configured sandbox runtime." in exec_result.stderr:
                    # In M19 we passed this through. In M20 we must cleanly fail the submission.
                    status = "system_error"
                    error_msg = "Secure code execution requires the configured sandbox runtime."
                    break
                else:
                    status = "runtime_error"
                    break
            elif exec_result.status == "timeout":
                status = "time_limit"
                break
            elif exec_result.status == "compile_error":
                status = "compile_error"
                error_msg = exec_result.stderr
                break
            
            # Deterministic Comparison
            if output_comparator.compare(exec_result.stdout, tc["expectedOutput"]):
                passed_tests += 1
            else:
                status = "wrong_answer"
                break # Early termination

        # Scoring & Solved Logic
        score = 100 if status == "accepted" else 0
        is_first_solve = False

        if status == "accepted":
            if uid not in self._solved_problems:
                self._solved_problems[uid] = set()
            
            if request.problemId not in self._solved_problems[uid]:
                self._solved_problems[uid].add(request.problemId)
                is_first_solve = True

        submission_id = f"sub_{uuid.uuid4().hex[:10]}"
        response = CodingSubmissionResponse(
            submissionId=submission_id,
            problemId=request.problemId,
            status=status,
            language=request.language,
            passedTests=passed_tests,
            totalTests=total_tests,
            score=score,
            executionTimeMs=total_time,
            memoryUsage="12 MB", # Mock memory usage
            submittedAt=datetime.utcnow().isoformat() + "Z",
            isFirstSolve=is_first_solve,
            errorMessage=error_msg
        )

        if uid not in self._submission_history:
            self._submission_history[uid] = []
        self._submission_history[uid].append(response)

        return response

coding_evaluation_service = CodingEvaluationService()
