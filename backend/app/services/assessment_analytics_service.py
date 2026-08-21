from typing import List, Dict, Any
from app.schemas.assessment import (
    TopicResult, SectionResult, QuestionResult
)

class AssessmentAnalyticsService:
    def __init__(self):
        self.strength_threshold = 75.0
        self.weakness_threshold = 60.0
        self.min_topic_questions = 2

    def calculate_percentage(self, score: float, max_score: float) -> float:
        if max_score <= 0:
            return 0.0
        return round((score / max_score) * 100, 2)

    def calculate_accuracy(self, correct: int, incorrect: int) -> float:
        total_attempted = correct + incorrect
        if total_attempted == 0:
            return 0.0
        return round((correct / total_attempted) * 100, 2)

    def classify_performance(self, percentage: float) -> str:
        if percentage >= 90:
            return "Excellent"
        elif percentage >= 75:
            return "Strong"
        elif percentage >= 60:
            return "Good"
        elif percentage >= 40:
            return "Needs Improvement"
        else:
            return "Needs Significant Improvement"

    def determine_strengths_and_weaknesses(self, topics: List[TopicResult], sections: List[SectionResult]) -> tuple[List[str], List[str]]:
        strengths = []
        weaknesses = []

        # Analyze topics first
        for t in topics:
            if t.percentage >= self.strength_threshold:
                strengths.append(t.topic)
            elif t.percentage < self.weakness_threshold:
                weaknesses.append(t.topic)

        # Fallback to sections if topics are insufficient
        if not strengths and not weaknesses:
            for s in sections:
                if s.percentage >= self.strength_threshold:
                    strengths.append(s.title)
                elif s.percentage < self.weakness_threshold:
                    weaknesses.append(s.title)

        return strengths, weaknesses

assessment_analytics_service = AssessmentAnalyticsService()
