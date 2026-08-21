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
from app.services.prompts.technical_python import get_python_question_prompt

PYTHON_TOPICS = [
    {"id": "py_intro", "name": "Introduction to Python", "desc": "History, syntax, REPL"},
    {"id": "py_syntax", "name": "Python Syntax", "desc": "Indentation, comments, quotes"},
    {"id": "py_variables", "name": "Variables", "desc": "Naming, assignment, dynamic typing"},
    {"id": "py_datatypes", "name": "Data Types", "desc": "int, float, str, bool"},
    {"id": "py_type_conversion", "name": "Type Conversion", "desc": "Implicit, explicit casting"},
    {"id": "py_operators", "name": "Operators", "desc": "Arithmetic, logical, membership, identity"},
    {"id": "py_io", "name": "Input and Output", "desc": "print(), input(), f-strings"},
    {"id": "py_conditionals", "name": "Conditional Statements", "desc": "if, elif, else"},
    {"id": "py_loops", "name": "Loops", "desc": "for, while, break, continue, else"},
    {"id": "py_functions", "name": "Functions", "desc": "def, return, scope"},
    {"id": "py_function_args", "name": "Function Arguments", "desc": "*args, **kwargs, defaults"},
    {"id": "py_lambdas", "name": "Lambda Functions", "desc": "Anonymous functions, map, filter"},
    {"id": "py_lists", "name": "Lists", "desc": "Creation, methods, mutable"},
    {"id": "py_tuples", "name": "Tuples", "desc": "Creation, immutable, packing/unpacking"},
    {"id": "py_sets", "name": "Sets", "desc": "Unique elements, operations"},
    {"id": "py_dictionaries", "name": "Dictionaries", "desc": "Key-value pairs, methods"},
    {"id": "py_strings", "name": "Strings", "desc": "Methods, immutability, formatting"},
    {"id": "py_list_comp", "name": "List Comprehension", "desc": "Concise list creation"},
    {"id": "py_dict_comp", "name": "Dictionary Comprehension", "desc": "Concise dict creation"},
    {"id": "py_slicing", "name": "Slicing", "desc": "Sequences, step, indexing"},
    {"id": "py_modules", "name": "Modules", "desc": "import, from, aliasing"},
    {"id": "py_packages", "name": "Packages", "desc": "__init__.py, directory structure"},
    {"id": "py_exceptions", "name": "Exception Handling", "desc": "try, except, finally, raise"},
    {"id": "py_file_handling", "name": "File Handling", "desc": "open, read, write, modes"},
    {"id": "py_oop", "name": "Object-Oriented Programming", "desc": "Classes, objects, self"},
    {"id": "py_classes", "name": "Classes and Objects", "desc": "Attributes, methods"},
    {"id": "py_constructors", "name": "Constructors", "desc": "__init__ method"},
    {"id": "py_inheritance", "name": "Inheritance", "desc": "Single, multiple, super()"},
    {"id": "py_polymorphism", "name": "Polymorphism", "desc": "Duck typing, overriding"},
    {"id": "py_encapsulation", "name": "Encapsulation", "desc": "Private/protected members"},
    {"id": "py_abstraction", "name": "Abstraction", "desc": "ABC, abstract methods"},
    {"id": "py_iterators", "name": "Iterators", "desc": "Iterable, __iter__, __next__"},
    {"id": "py_generators", "name": "Generators", "desc": "yield, memory efficiency"},
    {"id": "py_decorators", "name": "Decorators", "desc": "@ syntax, wrapper functions"},
    {"id": "py_context_managers", "name": "Context Managers", "desc": "with statement, __enter__, __exit__"},
    {"id": "py_regex", "name": "Regular Expressions", "desc": "re module, patterns"},
    {"id": "py_datetime", "name": "Date and Time", "desc": "datetime module, formatting"},
    {"id": "py_venvs", "name": "Virtual Environments", "desc": "venv, pip, requirements.txt"},
    {"id": "py_stdlib", "name": "Python Standard Library", "desc": "math, random, os, sys"},
    {"id": "py_memory", "name": "Memory Management", "desc": "Reference counting, GC"},
    {"id": "py_copy", "name": "Shallow Copy and Deep Copy", "desc": "copy module, references"},
    {"id": "py_itertools", "name": "Itertools", "desc": "chain, cycle, combinations"},
    {"id": "py_collections", "name": "Collections Module", "desc": "Counter, defaultdict, namedtuple"},
    {"id": "py_functional", "name": "Functional Programming", "desc": "Pure functions, map, reduce"},
    {"id": "py_advanced", "name": "Advanced Python", "desc": "Metaclasses, descriptors"}
]

class PythonProgrammingService:
    def __init__(self):
        self._topics = [
            TechnicalTopic(
                topicId=t["id"],
                name=t["name"],
                language=TechnicalLanguage.python,
                description=t["desc"],
                questionCount=0 # Static representation
            )
            for t in PYTHON_TOPICS
        ]
        self._sessions: Dict[str, List[TechnicalSession]] = {}

    def get_topics(self) -> List[TechnicalTopic]:
        return self._topics
        
    def get_topic(self, topic_id: str) -> Optional[TechnicalTopic]:
        for t in self._topics:
            if t.topicId == topic_id:
                return t
        return None

    async def generate_python_question(
        self, 
        topic: str, 
        difficulty: TechnicalDifficulty, 
        q_type: TechnicalQuestionType
    ) -> TechnicalQuestion:
        
        prompt = get_python_question_prompt(topic, difficulty, q_type)
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
            print(f"Python Question generation failed: {str(e)} | Raw: {response_text}")
            raise ValueError("Failed to generate a valid Python question. Please try again.")

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
                q = await self.generate_python_question(topic, difficulty, q_type)
                questions.append(q)
            except Exception:
                break
                
        if not questions:
            raise ValueError("Could not generate Python questions for this session.")

        session = TechnicalSession(
            sessionId=f"pythonsession_{uuid.uuid4().hex[:10]}",
            uid=uid,
            language=TechnicalLanguage.python,
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

python_service = PythonProgrammingService()
