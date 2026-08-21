import uuid
import json
from datetime import datetime
from typing import List, Dict, Optional
from app.schemas.technical import (
    TechnicalLanguage, TechnicalTopic, TechnicalModule, 
    TechnicalQuestion, TechnicalSession, TechnicalResult,
    TechnicalDifficulty, TechnicalQuestionType
)
from app.services.gemini_service import gemini_service
from app.services.prompts.technical_c import get_c_question_prompt

C_TOPICS = [
    {"id": "c_intro", "name": "Introduction to C", "desc": "History, execution flow, structure of C program"},
    {"id": "c_variables", "name": "Variables and Data Types", "desc": "int, char, float, double, modifiers"},
    {"id": "c_operators", "name": "Operators", "desc": "Arithmetic, relational, logical, bitwise"},
    {"id": "c_io", "name": "Input and Output", "desc": "printf, scanf, format specifiers"},
    {"id": "c_conditionals", "name": "Conditional Statements", "desc": "if, else, switch, ternary"},
    {"id": "c_loops", "name": "Loops", "desc": "for, while, do-while, break, continue"},
    {"id": "c_functions", "name": "Functions", "desc": "Declaration, definition, call by value"},
    {"id": "c_arrays", "name": "Arrays", "desc": "1D arrays, multidimensional arrays"},
    {"id": "c_strings", "name": "Strings", "desc": "String literals, string.h functions"},
    {"id": "c_pointers", "name": "Pointers", "desc": "Address, dereferencing, void pointers"},
    {"id": "c_pointer_arithmetic", "name": "Pointer Arithmetic", "desc": "Increment, decrement, pointer comparisons"},
    {"id": "c_structures", "name": "Structures", "desc": "struct, padding, nested structures"},
    {"id": "c_unions", "name": "Unions", "desc": "Memory sharing, enum"},
    {"id": "c_enums", "name": "Enumerations", "desc": "enum types and constants"},
    {"id": "c_dynamic_memory", "name": "Dynamic Memory Allocation", "desc": "malloc, calloc, realloc, free"},
    {"id": "c_recursion", "name": "Recursion", "desc": "Base case, stack overflow, tail recursion"},
    {"id": "c_storage_classes", "name": "Storage Classes", "desc": "auto, register, static, extern"},
    {"id": "c_preprocessor", "name": "Preprocessor", "desc": "#define, macros, conditional compilation"},
    {"id": "c_file_handling", "name": "File Handling", "desc": "fopen, fread, fwrite, fclose"},
    {"id": "c_cli_args", "name": "Command Line Arguments", "desc": "argc, argv"},
    {"id": "c_bitwise", "name": "Bitwise Operators", "desc": "AND, OR, XOR, shifts"},
    {"id": "c_type_casting", "name": "Type Casting", "desc": "Implicit vs Explicit conversion"},
    {"id": "c_scope", "name": "Scope and Lifetime", "desc": "Block, function, global scope"},
    {"id": "c_memory_management", "name": "Memory Management", "desc": "Stack vs Heap, memory leaks"},
    {"id": "c_stdlib", "name": "C Standard Library", "desc": "Common headers and library functions"},
    {"id": "c_advanced", "name": "Advanced C Concepts", "desc": "Function pointers, variable arguments"}
]

class CProgrammingService:
    def __init__(self):
        self._topics = [
            TechnicalTopic(
                topicId=t["id"],
                name=t["name"],
                language=TechnicalLanguage.c,
                description=t["desc"],
                questionCount=0 # Static representation
            )
            for t in C_TOPICS
        ]
        self._sessions: Dict[str, List[TechnicalSession]] = {}

    def get_topics(self) -> List[TechnicalTopic]:
        return self._topics
        
    def get_topic(self, topic_id: str) -> Optional[TechnicalTopic]:
        for t in self._topics:
            if t.topicId == topic_id:
                return t
        return None

    async def generate_c_question(
        self, 
        topic: str, 
        difficulty: TechnicalDifficulty, 
        q_type: TechnicalQuestionType
    ) -> TechnicalQuestion:
        
        prompt = get_c_question_prompt(topic, difficulty, q_type)
        response_text = await gemini_service.generate_content(prompt)
        
        try:
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_text)
            
            if data.get("questionType") in ["mcq", "output", "debugging"]:
                if not data.get("options") or len(data["options"]) != 4:
                    raise ValueError("Question must have exactly 4 options.")
                if data.get("correctOption") is None or not (0 <= data["correctOption"] <= 3):
                    raise ValueError("correctOption must be an index between 0 and 3.")
            
            question = TechnicalQuestion(**data)
            question.questionId = f"tech_q_{uuid.uuid4().hex[:8]}"
            return question
            
        except (json.JSONDecodeError, ValueError) as e:
            print(f"C Question generation failed: {str(e)} | Raw: {response_text}")
            raise ValueError("Failed to generate a valid C question. Please try again.")

    async def start_session(
        self, 
        uid: str, 
        topic: str, 
        difficulty: TechnicalDifficulty, 
        q_type: TechnicalQuestionType,
        count: int = 5
    ) -> TechnicalSession:
        
        # In a production app, we would parallelize generation or pull from a DB.
        # For M22, we will generate the requested number of questions iteratively.
        # To avoid massive latency on 20 questions via Gemini, we will generate 
        # up to `count` but realistically it might take time.
        questions = []
        for i in range(count):
            try:
                q = await self.generate_c_question(topic, difficulty, q_type)
                questions.append(q)
            except Exception:
                # If one fails, just break early instead of crashing the whole session
                break
                
        if not questions:
            raise ValueError("Could not generate C questions for this session.")

        session = TechnicalSession(
            sessionId=f"csession_{uuid.uuid4().hex[:10]}",
            uid=uid,
            language=TechnicalLanguage.c,
            topic=topic,
            difficulty=difficulty,
            questionCount=len(questions),
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

c_service = CProgrammingService()
