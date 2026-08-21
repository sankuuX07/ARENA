import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.assessment import (
    AssessmentSession, Assessment, AssessmentResult, SectionResult, TopicResult, QuestionResult,
    AssessmentCategory, AssessmentQuestionType
)

from app.services.assessment_analytics_service import assessment_analytics_service

class AssessmentResultService:
    def __init__(self):
        self._results: Dict[str, AssessmentResult] = {}
        self._question_results: Dict[str, List[QuestionResult]] = {}

    def generate_result(self, session: AssessmentSession, assessment: Assessment, current_time: datetime) -> AssessmentResult:
        result_id = f"res_{uuid.uuid4().hex[:8]}"
        
        start_time = datetime.fromisoformat(session.startedAt.replace("Z", "+00:00")).replace(tzinfo=None)
        time_used = int((current_time - start_time).total_seconds())
        total_time = assessment.config.durationMinutes * 60

        total_score = 0.0
        total_max_score = 0.0
        total_correct = 0
        total_incorrect = 0
        total_unanswered = 0

        section_map: Dict[str, SectionResult] = {}
        for sec in assessment.config.sections:
            section_map[sec.sectionId] = SectionResult(
                sectionId=sec.sectionId,
                title=sec.title,
                score=0.0,
                maxScore=0.0,
                percentage=0.0,
                correct=0,
                incorrect=0,
                unanswered=0,
                accuracy=0.0
            )

        q_results = []
        
        # Evaluate each answer
        for q in session.questions:
            sec_id = q.sectionId or "default"
            sec = section_map.get(sec_id)
            if not sec:
                sec = SectionResult(sectionId=sec_id, title="General", score=0.0, maxScore=0.0, percentage=0.0, correct=0, incorrect=0, unanswered=0, accuracy=0.0)
                section_map[sec_id] = sec

            sec.maxScore += q.marks
            total_max_score += q.marks
            
            ans = next((a for a in session.answers if a.questionId == q.questionId), None)
            
            is_correct = False
            marks_awarded = 0.0
            student_val = None
            correct_val = None

            if q.type == AssessmentQuestionType.mcq:
                from app.services.assessment_service import MOCK_ANSWERS_MAP
                correct_opt = MOCK_ANSWERS_MAP.get(q.questionId, 0)
                correct_val = f"Option {correct_opt}" if correct_opt is not None else None
                
                if ans and ans.selectedOption is not None:
                    student_val = f"Option {ans.selectedOption}"
                    if ans.selectedOption == correct_opt:
                        is_correct = True
                        marks_awarded = q.marks
                        sec.correct += 1
                        total_correct += 1
                    else:
                        marks_awarded = -q.negativeMarks
                        sec.incorrect += 1
                        total_incorrect += 1
                else:
                    sec.unanswered += 1
                    total_unanswered += 1
            else:
                # Coding/Communication mock evaluation
                if ans and ans.textResponse:
                    student_val = "Submitted Payload"
                    # Mock 80% marks for coding/communication
                    is_correct = True
                    marks_awarded = q.marks * 0.8
                    sec.correct += 1
                    total_correct += 1
                else:
                    sec.unanswered += 1
                    total_unanswered += 1

            sec.score += marks_awarded
            total_score += marks_awarded

            q_results.append(QuestionResult(
                questionId=q.questionId,
                sectionId=sec.sectionId,
                isCorrect=is_correct,
                marksAwarded=marks_awarded,
                studentAnswer=student_val,
                correctAnswer=correct_val,
                explanation="Detailed explanation will appear here."
            ))

        # Finalize sections
        sections_list = []
        for sec in section_map.values():
            sec.percentage = assessment_analytics_service.calculate_percentage(sec.score, sec.maxScore)
            sec.accuracy = assessment_analytics_service.calculate_accuracy(sec.correct, sec.incorrect)
            sections_list.append(sec)

        percentage = assessment_analytics_service.calculate_percentage(total_score, total_max_score)
        accuracy = assessment_analytics_service.calculate_accuracy(total_correct, total_incorrect)
        passed = percentage >= assessment.config.passingScore
        classification = assessment_analytics_service.classify_performance(percentage)

        topics_list: List[TopicResult] = [] # M29 mock topics
        
        strengths, weaknesses = assessment_analytics_service.determine_strengths_and_weaknesses(topics_list, sections_list)

        result = AssessmentResult(
            resultId=result_id,
            sessionId=session.sessionId,
            assessmentId=assessment.assessmentId,
            userId=session.userId,
            status="evaluated",
            score=total_score,
            maxScore=total_max_score,
            percentage=percentage,
            accuracy=accuracy,
            correct=total_correct,
            incorrect=total_incorrect,
            unanswered=total_unanswered,
            timeUsedSeconds=min(time_used, total_time),
            totalTimeSeconds=total_time,
            passed=passed,
            completedAt=current_time.isoformat() + "Z",
            sections=sections_list,
            topics=topics_list,
            strengths=strengths,
            improvementAreas=weaknesses,
            performanceClassification=classification
        )

        self._results[result_id] = result
        self._question_results[result_id] = q_results

        return result

    def get_result(self, result_id: str, user_id: str) -> Optional[AssessmentResult]:
        res = self._results.get(result_id)
        if res and res.userId == user_id:
            return res
        return None

    def get_review(self, result_id: str, user_id: str) -> Optional[List[QuestionResult]]:
        res = self.get_result(result_id, user_id)
        if res:
            return self._question_results.get(result_id)
        return None

    def get_history(self, user_id: str) -> List[AssessmentResult]:
        return [r for r in self._results.values() if r.userId == user_id]

assessment_result_service = AssessmentResultService()
