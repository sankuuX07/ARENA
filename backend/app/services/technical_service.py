import uuid
import json
from datetime import datetime
from typing import List, Dict, Optional
from app.schemas.technical import (
    TechnicalLanguage, TechnicalTopic, TechnicalModule, 
    TechnicalQuestion, TechnicalSession, TechnicalAnswerRequest, TechnicalResult,
    TechnicalDifficulty, TechnicalQuestionType
)
from app.services.gemini_service import gemini_service
from app.services.prompts.technical_prompts import get_technical_question_prompt

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
        response_text = await gemini_service.generate_content(prompt)
        
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
    ) -> TechnicalSession:
        
        # In M21, we dynamically generate one question to prove the architecture.
        # Future milestones will pull from a vast pre-generated static bank or dynamic batches.
        questions = []
        try:
            # Generate one MCQ for the architecture foundation
            q = await self.generate_technical_question(language, topic, difficulty, TechnicalQuestionType.mcq)
            questions.append(q)
        except ValueError:
            # Fallback if AI fails during demo
            q = TechnicalQuestion(
                questionId=f"tech_q_{uuid.uuid4().hex[:8]}",
                language=language,
                topic=topic,
                difficulty=difficulty,
                questionType=TechnicalQuestionType.mcq,
                question="What is the primary purpose of this topic?",
                options=["Option A", "Option B", "Option C", "Option D"],
                correctOption=0,
                explanation="This is a foundational architecture fallback question."
            )
            questions.append(q)

        session = TechnicalSession(
            sessionId=f"tsession_{uuid.uuid4().hex[:10]}",
            uid=uid,
            language=language,
            topic=topic,
            difficulty=difficulty,
            questionCount=len(questions), # Actual count generated
            startedAt=datetime.utcnow().isoformat() + "Z",
            questions=questions
        )
        
        if uid not in self._sessions:
            self._sessions[uid] = []
        self._sessions[uid].append(session)
        
        return session

    def get_session(self, uid: str, session_id: str) -> Optional[TechnicalSession]:
        for s in self._sessions.get(uid, []):
            if s.sessionId == session_id:
                return s
        return None

    def complete_session(self, uid: str, session_id: str, final_score: int) -> TechnicalResult:
        session = self.get_session(uid, session_id)
        if not session:
            raise ValueError("Session not found")
            
        session.status = "completed"
        session.completedAt = datetime.utcnow().isoformat() + "Z"
        session.score = final_score
        
        acc = int((final_score / session.questionCount) * 100) if session.questionCount > 0 else 0
        
        return TechnicalResult(
            sessionId=session.sessionId,
            score=final_score,
            totalQuestions=session.questionCount,
            accuracy=acc,
            completedAt=session.completedAt
        )

technical_service = TechnicalService()
