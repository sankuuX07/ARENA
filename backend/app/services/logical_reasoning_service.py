import json
import logging
import uuid
from datetime import datetime
from typing import List, Dict
from app.schemas.logical import (
    LogicalStartRequest,
    LogicalStartResponse,
    LogicalSessionCompleteRequest,
    LogicalSessionSummary,
    LogicalQuestion,
    ClientLogicalQuestion
)
from app.services.gemini_service import gemini_service
from app.services.prompts.logical_reasoning import LOGICAL_GENERATION_PROMPT

logger = logging.getLogger(__name__)

class LogicalReasoningService:
    def __init__(self):
        self._sessions: Dict[str, List[LogicalQuestion]] = {}

    async def start_session(self, request: LogicalStartRequest) -> LogicalStartResponse:
        session_id = f"logical_{uuid.uuid4().hex[:10]}"
        
        prompt = LOGICAL_GENERATION_PROMPT.format(
            num_questions=request.num_questions,
            topic=request.topic,
            difficulty=request.difficulty
        )
        
        raw_response = await gemini_service.generate_json_response(
            system_instruction=(
                "You are an expert logical reasoning question generator for placement exams. "
                "Generate multiple-choice questions as a JSON array. "
                "Respond ONLY with a valid JSON array, no other text."
            ),
            message=prompt
        )
        
        questions = self._parse_questions(raw_response, request.num_questions, request.topic)
        
        self._sessions[session_id] = questions

        client_questions = [
            ClientLogicalQuestion(
                question_id=q.question_id,
                question=q.question,
                options=q.options
            ) for q in questions
        ]
        
        return LogicalStartResponse(
            session_id=session_id,
            category=request.category,
            topic=request.topic,
            difficulty=request.difficulty,
            questions=client_questions
        )

    async def complete_session(self, request: LogicalSessionCompleteRequest) -> LogicalSessionSummary:
        real_questions = self._sessions.get(request.session_id, [])
        if not real_questions:
            raise ValueError("Session expired or not found")
            
        total_questions = len(real_questions)
        correct = 0
        incorrect = 0
        unanswered = 0
        
        for q in real_questions:
            student_answer = request.answers.get(q.question_id)
            if student_answer is None or student_answer == -1:
                unanswered += 1
            elif student_answer == q.correctOption:
                correct += 1
            else:
                incorrect += 1
                
        score = correct
        accuracy = round((correct / total_questions) * 100) if total_questions > 0 else 0
        
        return LogicalSessionSummary(
            session_id=request.session_id,
            category=request.category,
            topic=request.topic,
            difficulty=request.difficulty,
            total_questions=total_questions,
            correct=correct,
            incorrect=incorrect,
            unanswered=unanswered,
            score=score,
            accuracy=accuracy,
            time_taken=0, # Typically calculated or provided by frontend
            completed_at=datetime.utcnow().isoformat() + "Z"
        )

    def _parse_questions(self, raw_response: str, expected_count: int, topic: str) -> List[LogicalQuestion]:
        import re
        try:
            text = raw_response.strip()
            md = re.search(r'```(?:json)?\s*(.*?)\s*```', text, re.DOTALL)
            if md:
                text = md.group(1).strip()
            start = text.find('[')
            end = text.rfind(']')
            if start == -1 or end == -1:
                raise ValueError("No JSON array found")
            data = json.loads(text[start:end+1])
            questions = []
            for item in data:
                if not isinstance(item, dict):
                    continue
                options = item.get("options", [])
                if not isinstance(options, list) or len(options) != 4:
                    continue
                correct = item.get("correctOption")
                if correct is None and "answer" in item:
                    try:
                        correct = int(item["answer"])
                        if correct in [1,2,3,4]:
                            correct -= 1
                    except (ValueError, TypeError):
                        continue
                if not isinstance(correct, int) or correct not in [0,1,2,3]:
                    continue
                q = LogicalQuestion(
                    question_id=f"q_{uuid.uuid4().hex[:8]}",
                    question=item["question"],
                    options=[str(o) for o in options],
                    correctOption=correct,
                    explanation=item.get("explanation", "No explanation provided.")
                )
                questions.append(q)
            if not questions:
                raise ValueError("No valid questions parsed")
            return questions[:expected_count]
        except Exception as e:
            logger.warning(f"Failed to parse AI logical questions JSON: {e}")
            raise ValueError("Failed to parse AI logical reasoning questions.")

logical_reasoning_service = LogicalReasoningService()
