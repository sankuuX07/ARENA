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
from app.services.prompts.technical_cpp import get_cpp_question_prompt

CPP_TOPICS = [
    {"id": "cpp_intro", "name": "Introduction to C++", "desc": "History, syntax, namespaces"},
    {"id": "cpp_variables", "name": "Variables and Data Types", "desc": "Primitive types, auto, modifiers"},
    {"id": "cpp_io", "name": "Input and Output", "desc": "cin, cout, cerr, manipulators"},
    {"id": "cpp_operators", "name": "Operators", "desc": "Arithmetic, logical, bitwise"},
    {"id": "cpp_conditionals", "name": "Conditional Statements", "desc": "if, switch"},
    {"id": "cpp_loops", "name": "Loops", "desc": "for, while, range-based for"},
    {"id": "cpp_functions", "name": "Functions", "desc": "Declaration, pass by value/reference"},
    {"id": "cpp_arrays", "name": "Arrays", "desc": "C-style arrays, std::array"},
    {"id": "cpp_strings", "name": "Strings", "desc": "std::string, operations"},
    {"id": "cpp_pointers", "name": "Pointers", "desc": "Address, dereferencing, void pointers"},
    {"id": "cpp_references", "name": "References", "desc": "Lvalue, Rvalue references"},
    {"id": "cpp_classes", "name": "Classes and Objects", "desc": "Class declaration, object instantiation"},
    {"id": "cpp_constructors", "name": "Constructors and Destructors", "desc": "Default, copy, move constructors"},
    {"id": "cpp_encapsulation", "name": "Encapsulation", "desc": "Access specifiers, getters, setters"},
    {"id": "cpp_inheritance", "name": "Inheritance", "desc": "Single, multiple, access control"},
    {"id": "cpp_polymorphism", "name": "Polymorphism", "desc": "Compile-time vs Run-time"},
    {"id": "cpp_abstraction", "name": "Abstraction", "desc": "Abstract classes, pure virtual functions"},
    {"id": "cpp_function_overloading", "name": "Function Overloading", "desc": "Same name, different parameters"},
    {"id": "cpp_operator_overloading", "name": "Operator Overloading", "desc": "Custom behavior for operators"},
    {"id": "cpp_virtual_functions", "name": "Virtual Functions", "desc": "vtable, override, final"},
    {"id": "cpp_templates", "name": "Templates", "desc": "Function templates, class templates"},
    {"id": "cpp_exceptions", "name": "Exception Handling", "desc": "try, catch, throw"},
    {"id": "cpp_stl", "name": "STL Overview", "desc": "Containers, Algorithms, Iterators"},
    {"id": "cpp_vector", "name": "Vector", "desc": "std::vector operations"},
    {"id": "cpp_stack", "name": "Stack", "desc": "LIFO container adaptor"},
    {"id": "cpp_queue", "name": "Queue", "desc": "FIFO container adaptor"},
    {"id": "cpp_set", "name": "Set", "desc": "std::set, unordered_set"},
    {"id": "cpp_map", "name": "Map", "desc": "std::map, unordered_map"},
    {"id": "cpp_iterators", "name": "Iterators", "desc": "begin, end, advance"},
    {"id": "cpp_algorithms", "name": "Algorithms Library", "desc": "sort, find, transform"},
    {"id": "cpp_lambdas", "name": "Lambda Expressions", "desc": "Anonymous functions, captures"},
    {"id": "cpp_smart_pointers", "name": "Smart Pointers", "desc": "unique_ptr, shared_ptr, weak_ptr"},
    {"id": "cpp_dynamic_memory", "name": "Dynamic Memory", "desc": "new, delete, RAII"},
    {"id": "cpp_file_handling", "name": "File Handling", "desc": "fstream, ifstream, ofstream"},
    {"id": "cpp_recursion", "name": "Recursion", "desc": "Base case, memory implications"},
    {"id": "cpp_modern", "name": "Modern C++", "desc": "C++11/14/17 features"},
    {"id": "cpp_advanced", "name": "Advanced C++", "desc": "Move semantics, concurrency"}
]

class CppProgrammingService:
    def __init__(self):
        self._topics = [
            TechnicalTopic(
                topicId=t["id"],
                name=t["name"],
                language=TechnicalLanguage.cpp,
                description=t["desc"],
                questionCount=0 # Static representation
            )
            for t in CPP_TOPICS
        ]
        self._sessions: Dict[str, List[TechnicalSession]] = {}

    def get_topics(self) -> List[TechnicalTopic]:
        return self._topics
        
    def get_topic(self, topic_id: str) -> Optional[TechnicalTopic]:
        for t in self._topics:
            if t.topicId == topic_id:
                return t
        return None

    async def generate_cpp_question(
        self, 
        topic: str, 
        difficulty: TechnicalDifficulty, 
        q_type: TechnicalQuestionType
    ) -> TechnicalQuestion:
        
        prompt = get_cpp_question_prompt(topic, difficulty, q_type)
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
            print(f"C++ Question generation failed: {str(e)} | Raw: {response_text}")
            raise ValueError("Failed to generate a valid C++ question. Please try again.")

    async def start_session(
        self, 
        uid: str, 
        topic: str, 
        difficulty: TechnicalDifficulty, 
        q_type: TechnicalQuestionType,
        count: int = 5
    ) -> TechnicalSession:
        
        questions = []
        for i in range(count):
            try:
                q = await self.generate_cpp_question(topic, difficulty, q_type)
                questions.append(q)
            except Exception:
                break
                
        if not questions:
            raise ValueError("Could not generate C++ questions for this session.")

        session = TechnicalSession(
            sessionId=f"cppsession_{uuid.uuid4().hex[:10]}",
            uid=uid,
            language=TechnicalLanguage.cpp,
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

cpp_service = CppProgrammingService()
