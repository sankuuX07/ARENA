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
from app.services.prompts.technical_java import get_java_question_prompt

JAVA_TOPICS = [
    {"id": "java_intro", "name": "Introduction to Java", "desc": "History, features, platform independence"},
    {"id": "java_jvm", "name": "JDK, JRE and JVM", "desc": "Architecture, compilation vs interpretation"},
    {"id": "java_variables", "name": "Variables and Data Types", "desc": "Primitives, wrappers, naming conventions"},
    {"id": "java_casting", "name": "Type Casting", "desc": "Implicit, explicit, object casting"},
    {"id": "java_operators", "name": "Operators", "desc": "Arithmetic, logical, bitwise, assignment"},
    {"id": "java_io", "name": "Input and Output", "desc": "Scanner, BufferedReader, formatting"},
    {"id": "java_conditionals", "name": "Conditional Statements", "desc": "if, switch, ternary operator"},
    {"id": "java_loops", "name": "Loops", "desc": "for, while, do-while, enhanced for"},
    {"id": "java_arrays", "name": "Arrays", "desc": "1D, 2D arrays, Arrays utility class"},
    {"id": "java_strings", "name": "Strings", "desc": "String pool, immutability, methods"},
    {"id": "java_stringbuilder", "name": "StringBuilder and StringBuffer", "desc": "Mutability, thread-safety"},
    {"id": "java_methods", "name": "Methods", "desc": "Declaration, pass-by-value"},
    {"id": "java_method_overloading", "name": "Method Overloading", "desc": "Compile-time polymorphism"},
    {"id": "java_classes", "name": "Classes and Objects", "desc": "Class anatomy, object creation"},
    {"id": "java_constructors", "name": "Constructors", "desc": "Default, parameterized, copy"},
    {"id": "java_this", "name": "this Keyword", "desc": "Current instance reference, constructor chaining"},
    {"id": "java_static", "name": "static Keyword", "desc": "Class variables, methods, blocks"},
    {"id": "java_final", "name": "final Keyword", "desc": "Constants, preventing inheritance/overriding"},
    {"id": "java_encapsulation", "name": "Encapsulation", "desc": "Data hiding, getters/setters"},
    {"id": "java_inheritance", "name": "Inheritance", "desc": "extends, IS-A relationship"},
    {"id": "java_method_overriding", "name": "Method Overriding", "desc": "Runtime polymorphism, @Override"},
    {"id": "java_polymorphism", "name": "Polymorphism", "desc": "Upcasting, downcasting"},
    {"id": "java_abstraction", "name": "Abstraction", "desc": "Hiding implementation details"},
    {"id": "java_interfaces", "name": "Interfaces", "desc": "Multiple inheritance, default methods"},
    {"id": "java_abstract_classes", "name": "Abstract Classes", "desc": "Partial abstraction, abstract methods"},
    {"id": "java_packages", "name": "Packages", "desc": "Namespace management, imports"},
    {"id": "java_access_modifiers", "name": "Access Modifiers", "desc": "public, protected, default, private"},
    {"id": "java_exceptions", "name": "Exception Handling", "desc": "try-catch, throw, throws, finally"},
    {"id": "java_collections", "name": "Collections Framework", "desc": "Hierarchy, Iterable, Collection"},
    {"id": "java_list", "name": "List", "desc": "ArrayList, LinkedList, Vector"},
    {"id": "java_set", "name": "Set", "desc": "HashSet, LinkedHashSet, TreeSet"},
    {"id": "java_map", "name": "Map", "desc": "HashMap, LinkedHashMap, TreeMap"},
    {"id": "java_queue", "name": "Queue", "desc": "PriorityQueue, BlockingQueue"},
    {"id": "java_deque", "name": "Stack/Deque", "desc": "ArrayDeque, Stack"},
    {"id": "java_iterators", "name": "Iterators", "desc": "Iterator, ListIterator, Spliterator"},
    {"id": "java_generics", "name": "Generics", "desc": "Type safety, wildcards, bounds"},
    {"id": "java_wrappers", "name": "Wrapper Classes", "desc": "Integer, Double, Character"},
    {"id": "java_autoboxing", "name": "Autoboxing and Unboxing", "desc": "Automatic conversion"},
    {"id": "java_lambdas", "name": "Lambda Expressions", "desc": "Anonymous functions"},
    {"id": "java_functional", "name": "Functional Interfaces", "desc": "Predicate, Consumer, Function, Supplier"},
    {"id": "java_streams", "name": "Stream API", "desc": "Filter, map, reduce, collect"},
    {"id": "java_multithreading", "name": "Multithreading", "desc": "Thread class, Runnable interface"},
    {"id": "java_synchronization", "name": "Synchronization", "desc": "Locks, synchronized blocks, wait/notify"},
    {"id": "java_files", "name": "File Handling", "desc": "File, Path, Readers, Writers"},
    {"id": "java_serialization", "name": "Serialization", "desc": "Serializable, transient"},
    {"id": "java_gc", "name": "Garbage Collection", "desc": "Mark and sweep, System.gc()"},
    {"id": "java_memory", "name": "Memory Management", "desc": "Heap, Stack, Metaspace"},
    {"id": "java_8_plus", "name": "Java 8+ Features", "desc": "Optional, var, Records"},
    {"id": "java_jdbc", "name": "JDBC Fundamentals", "desc": "Connections, Statements, ResultSets"},
    {"id": "java_advanced", "name": "Advanced Java Concepts", "desc": "Reflection, Annotations, Networking"}
]

class JavaProgrammingService:
    def __init__(self):
        self._topics = [
            TechnicalTopic(
                topicId=t["id"],
                name=t["name"],
                language=TechnicalLanguage.java,
                description=t["desc"],
                questionCount=0 # Static representation
            )
            for t in JAVA_TOPICS
        ]
        self._sessions: Dict[str, List[TechnicalSession]] = {}

    def get_topics(self) -> List[TechnicalTopic]:
        return self._topics
        
    def get_topic(self, topic_id: str) -> Optional[TechnicalTopic]:
        for t in self._topics:
            if t.topicId == topic_id:
                return t
        return None

    async def generate_java_question(
        self, 
        topic: str, 
        difficulty: TechnicalDifficulty, 
        q_type: TechnicalQuestionType
    ) -> TechnicalQuestion:
        
        prompt = get_java_question_prompt(topic, difficulty, q_type)
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
            print(f"Java Question generation failed: {str(e)} | Raw: {response_text}")
            raise ValueError("Failed to generate a valid Java question. Please try again.")

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
                q = await self.generate_java_question(topic, difficulty, q_type)
                questions.append(q)
            except Exception:
                break
                
        if not questions:
            raise ValueError("Could not generate Java questions for this session.")

        session = TechnicalSession(
            sessionId=f"javasession_{uuid.uuid4().hex[:10]}",
            uid=uid,
            language=TechnicalLanguage.java,
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

java_service = JavaProgrammingService()
