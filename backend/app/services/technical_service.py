import uuid
import json
import logging
from datetime import datetime
from typing import List, Dict, Optional
from app.schemas.technical import (
    TechnicalLanguage, TechnicalTopic, TechnicalModule,
    TechnicalQuestion, ClientTechnicalQuestion, TechnicalSession, ClientTechnicalSession,
    TechnicalAnswerRequest, TechnicalAnswerResponse, TechnicalResult,
    TechnicalDifficulty, TechnicalQuestionType
)
from app.services.gemini_service import gemini_service
from app.services.prompts.technical_prompts import get_technical_question_prompt

logger = logging.getLogger(__name__)

# Foundation architecture static data for M21
MOCK_MODULES = [
    TechnicalModule(
        moduleId="mod_c",
        language=TechnicalLanguage.c,
        title="C",
        description="Master C programming fundamentals.",
        order=1,
        topics=[
            TechnicalTopic(topicId="c_basics", name="Basics", description="C Basics", language=TechnicalLanguage.c, questionCount=10),
            TechnicalTopic(topicId="c_pointers", name="Pointers", description="Pointers and memory management", language=TechnicalLanguage.c, questionCount=15)
        ]
    ),
    TechnicalModule(
        moduleId="mod_cpp",
        language=TechnicalLanguage.cpp,
        title="C++",
        description="Object-oriented programming and STL.",
        order=2,
        topics=[
            TechnicalTopic(topicId="cpp_oop", name="OOP", description="Classes and objects", language=TechnicalLanguage.cpp, questionCount=20),
            TechnicalTopic(topicId="cpp_stl", name="STL", description="Standard Template Library", language=TechnicalLanguage.cpp, questionCount=15)
        ]
    ),
    TechnicalModule(
        moduleId="mod_java",
        language=TechnicalLanguage.java,
        title="Java",
        description="Core Java and object-oriented programming.",
        order=3,
        topics=[
            TechnicalTopic(topicId="java_oop", name="Classes and Objects", description="OOP in Java", language=TechnicalLanguage.java, questionCount=25),
            TechnicalTopic(topicId="java_collections", name="Collections", description="Collections Framework", language=TechnicalLanguage.java, questionCount=20)
        ]
    ),
    TechnicalModule(
        moduleId="mod_python",
        language=TechnicalLanguage.python,
        title="Python",
        description="Python programming and problem solving.",
        order=4,
        topics=[
            TechnicalTopic(topicId="py_lists", name="Lists", description="Python Lists", language=TechnicalLanguage.python, questionCount=15),
            TechnicalTopic(topicId="py_oop", name="OOP", description="Python OOP", language=TechnicalLanguage.python, questionCount=15)
        ]
    ),
    TechnicalModule(
        moduleId="mod_cs_core",
        language=TechnicalLanguage.cs_core,
        title="CS Core",
        description="Prepare for technical interview concepts.",
        order=5,
        status="coming_soon",
        topics=[]
    )
]

class TechnicalService:
    def __init__(self):
        self._modules = {m.moduleId: m for m in MOCK_MODULES}
        # uid -> list of sessions
        self._sessions: Dict[str, List[TechnicalSession]] = {}

    def get_modules(self) -> List[TechnicalModule]:
        return sorted(list(self._modules.values()), key=lambda m: m.order)

    def get_module(self, module_id: str) -> Optional[TechnicalModule]:
        return self._modules.get(module_id)

    async def generate_technical_question(
        self, 
        language: TechnicalLanguage, 
        topic: str, 
        difficulty: TechnicalDifficulty, 
        q_type: TechnicalQuestionType
    ) -> TechnicalQuestion:
        
        prompt = get_technical_question_prompt(language, topic, difficulty, q_type)
        response_text = await gemini_service.generate_json_response('Respond ONLY with valid JSON.', prompt)
        
        # Validation layer
        try:
            # Clean possible markdown
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            
            # Validate structural integrity
            if data.get("questionType") in ["mcq", "output", "debugging"]:
                if not data.get("options") or len(data["options"]) != 4:
                    raise ValueError("MCQ must have exactly 4 options.")
                if data.get("correctOption") is None or not (0 <= data["correctOption"] <= 3):
                    raise ValueError("correctOption must be an index between 0 and 3.")
            
            # Use Pydantic to strictly validate
            question = TechnicalQuestion(**data)
            # Ensure ID uniqueness just in case AI duplicates
            question.questionId = f"tech_q_{uuid.uuid4().hex[:8]}"
            return question
            
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Technical generation validation failed: {str(e)} | Raw: {response_text}")
            raise ValueError("Failed to generate a valid technical question. Please try again.")

    async def start_session(
        self,
        uid: str,
        language: TechnicalLanguage,
        topic: str,
        difficulty: TechnicalDifficulty,
        count: int = 5
    ) -> ClientTechnicalSession:
        """
        Generate `count` questions via Ollama/Gemma, store full questions (with
        correctOption) server-side, and return ClientTechnicalSession (no answers).
        """
        count = max(1, min(count, 10))  # Clamp 1-10
        questions: List[TechnicalQuestion] = []
        
        for i in range(count):
            try:
                q = await self.generate_technical_question(
                    language, topic, difficulty, TechnicalQuestionType.mcq
                )
                questions.append(q)
            except ValueError as ve:
                logger.warning(f"Q{i+1} generation failed: {ve}")
                # Only add a fallback if we have NO questions at all
                if i == 0 and not questions:
                    questions.append(TechnicalQuestion(
                        questionId=f"tech_q_{uuid.uuid4().hex[:8]}",
                        language=language,
                        topic=topic,
                        difficulty=difficulty,
                        questionType=TechnicalQuestionType.mcq,
                        question=f"What is a fundamental concept in {topic} for {language.value.upper()}?",
                        options=["Concept A", "Concept B", "Concept C", "Concept D"],
                        correctOption=0,
                        explanation="AI service is temporarily unavailable. This is a placeholder question."
                    ))
        
        if not questions:
            raise ValueError("Failed to generate any technical questions. Please try again.")

        session = TechnicalSession(
            sessionId=f"tsession_{uuid.uuid4().hex[:10]}",
            uid=uid,
            language=language,
            topic=topic,
            difficulty=difficulty,
            questionCount=len(questions),
            startedAt=datetime.utcnow().isoformat() + "Z",
            questions=questions
        )

        if uid not in self._sessions:
            self._sessions[uid] = []
        self._sessions[uid].append(session)

        # Strip correct answers before returning to client
        client_questions = [
            ClientTechnicalQuestion(
                questionId=q.questionId,
                language=q.language,
                topic=q.topic,
                difficulty=q.difficulty,
                questionType=q.questionType,
                question=q.question,
                codeSnippet=q.codeSnippet,
                options=q.options,
            )
            for q in questions
        ]

        return ClientTechnicalSession(
            sessionId=session.sessionId,
            uid=session.uid,
            language=session.language,
            topic=session.topic,
            difficulty=session.difficulty,
            questionCount=session.questionCount,
            currentQuestionIndex=0,
            score=0,
            status="active",
            startedAt=session.startedAt,
            questions=client_questions,
        )

    def get_session(self, uid: str, session_id: str) -> Optional[TechnicalSession]:
        for s in self._sessions.get(uid, []):
            if s.sessionId == session_id:
                return s
        return None

    def submit_answer(self, uid: str, session_id: str, question_id: str, selected_option: int) -> TechnicalAnswerResponse:
        session = self.get_session(uid, session_id)
        if not session or session.status != "active":
            raise ValueError("Active session not found")
            
        for q in session.questions:
            if q.questionId == question_id:
                is_correct = (q.correctOption == selected_option)
                if is_correct:
                    session.score += 1
                return TechnicalAnswerResponse(
                    isCorrect=is_correct,
                    correctOption=q.correctOption,
                    explanation=q.explanation
                )
        raise ValueError("Question not found in session")

    def complete_session(self, uid: str, session_id: str) -> TechnicalResult:
        session = self.get_session(uid, session_id)
        if not session:
            raise ValueError("Session not found")
            
        session.status = "completed"
        session.completedAt = datetime.utcnow().isoformat() + "Z"
        acc = int((session.score / session.questionCount) * 100) if session.questionCount > 0 else 0
        
        return TechnicalResult(
            sessionId=session.sessionId,
            score=session.score,
            totalQuestions=session.questionCount,
            accuracy=acc,
            completedAt=session.completedAt
        )

technical_service = TechnicalService()
