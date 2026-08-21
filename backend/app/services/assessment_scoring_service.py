from app.schemas.assessment import AssessmentSession, AssessmentConfig, AssessmentResult

class AssessmentScoringService:
    def evaluate_session(self, session: AssessmentSession, config: AssessmentConfig, master_answers: dict) -> AssessmentResult:
        """
        Evaluates a completed assessment session securely on the backend.
        `master_answers` is a dict mapping questionId -> correctOption index (or expected answer format).
        """
        correct_count = 0
        incorrect_count = 0
        unanswered_count = 0
        total_score = 0.0
        max_score = 0.0

        for q_ref in session.questions:
            max_score += q_ref.marks
            
            # Find the student's answer for this question
            student_answer = next((a for a in session.answers if a.questionId == q_ref.questionId), None)
            
            if not student_answer or student_answer.selectedOption is None:
                unanswered_count += 1
                continue
                
            correct_option = master_answers.get(q_ref.questionId)
            
            if student_answer.selectedOption == correct_option:
                correct_count += 1
                total_score += q_ref.marks
            else:
                incorrect_count += 1
                if config.negativeMarking:
                    total_score -= q_ref.negativeMarks

        accuracy = int((correct_count / len(session.questions)) * 100) if len(session.questions) > 0 else 0
        passed = (total_score / max_score * 100) >= config.passingScore if max_score > 0 else False

        return AssessmentResult(
            sessionId=session.sessionId,
            score=total_score,
            maxScore=max_score,
            accuracy=accuracy,
            correct=correct_count,
            incorrect=incorrect_count,
            unanswered=unanswered_count,
            passed=passed
        )

assessment_scoring_service = AssessmentScoringService()
