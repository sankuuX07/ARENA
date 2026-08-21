import uuid
from typing import List, Optional
from app.schemas.assessment import (
    Assessment, AssessmentSection, AssessmentQuestionReference,
    AssessmentQuestionSource, AssessmentQuestionType, AssessmentCategory
)

class AssessmentTypeService:
    """
    Resolves actual questions from existing modules (Aptitude, Technical, Coding, Communication)
    and binds them into the AssessmentSession payload.
    """
    
    def resolve_questions(self, assessment: Assessment) -> List[AssessmentQuestionReference]:
        questions = []
        order = 1
        
        if not assessment.config.sections:
            # Fallback for simple assessments (M27 default behavior)
            return self._generate_mock_questions(assessment.assessmentId)

        for section in assessment.config.sections:
            section_questions = self._resolve_section_questions(assessment.assessmentId, section)
            for sq in section_questions:
                sq.order = order
                questions.append(sq)
                order += 1
                
        return questions

    def _resolve_section_questions(self, assessment_id: str, section: AssessmentSection) -> List[AssessmentQuestionReference]:
        questions = []
        
        # M28: In a full production build, this would ping `aptitude_service.generate_questions`, 
        # `puzzle_service.generate_problems`, etc. For now, we mock the resolution engine simulating 
        # that it successfully fetched from those existing collections.
        
        for i in range(section.questionCount):
            q_id = f"{section.sectionId}_q_{i+1}_{uuid.uuid4().hex[:6]}"
            aq_id = f"aq_{uuid.uuid4().hex[:8]}"
            
            q_type = AssessmentQuestionType.mcq
            metadata = {}
            options = None
            q_text = f"Sample {section.type} question for {section.source} (Q{i+1})"
            
            if section.type == AssessmentCategory.coding:
                q_type = AssessmentQuestionType.coding
                q_text = f"Write a {section.source} program to solve the given problem."
                metadata = {
                    "language": section.source,
                    "starterCode": f"// Starter code for {section.source}\n",
                    "testCases": 3
                }
            elif section.type == AssessmentCategory.communication:
                q_type = AssessmentQuestionType.communication
                q_text = f"Please read the following prompt for {section.source}."
                metadata = {
                    "mode": "voice",
                    "maxDurationSeconds": 60
                }
            else:
                q_type = AssessmentQuestionType.mcq
                options = ["Option A", "Option B", "Option C", "Option D"]
            
            ref = AssessmentQuestionReference(
                assessmentQuestionId=aq_id,
                assessmentId=assessment_id,
                sectionId=section.sectionId,
                questionId=q_id,
                type=q_type,
                source=AssessmentQuestionSource.module,
                order=0, # Set by parent
                marks=section.marks,
                negativeMarks=section.negativeMarks,
                questionText=q_text,
                options=options,
                metadata=metadata
            )
            questions.append(ref)
            
        return questions

    def _generate_mock_questions(self, assessment_id: str) -> List[AssessmentQuestionReference]:
        return [
            AssessmentQuestionReference(
                assessmentQuestionId="aq_1", assessmentId=assessment_id, questionId="q1",
                source=AssessmentQuestionSource.static, order=1, marks=10, negativeMarks=0,
                questionText="What is the worst-case time complexity of QuickSort?",
                options=["O(n)", "O(n log n)", "O(n^2)", "O(log n)"]
            )
        ]

assessment_type_service = AssessmentTypeService()
