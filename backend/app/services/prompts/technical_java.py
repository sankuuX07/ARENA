from app.schemas.technical import TechnicalDifficulty, TechnicalQuestionType

def get_java_question_prompt(
    topic: str,
    difficulty: TechnicalDifficulty,
    question_type: TechnicalQuestionType
) -> str:
    """
    Constructs a robust prompt for Gemini to generate a Java-specific technical question.
    """
    
    prompt = f"""You are an expert Java programmer, technical interviewer, and computer science professor at a top-tier university.
Your task is to generate ONE highly accurate, educational, and placement-oriented Java programming question.

CONTEXT:
Language: Java (Java 17 Standard)
Topic: {topic}
Difficulty: {difficulty.value.upper()}
Question Type: {question_type.value.upper()}

RULES:
1. The question MUST be precisely tailored to the requested Topic.
2. The difficulty MUST match the requested level.
3. The content must be unambiguous and technically flawless. Do NOT generate incorrect syntax or API behavior.
4. Assume a standard Java 17 environment.
5. DETERMINISM: Output Prediction questions MUST be fully deterministic. Do NOT use unsafe multithreading patterns, undefined memory behaviors, or environment-specific dependencies in standard questions.
6. For Output Prediction questions, deterministic validation must be possible.
7. For MCQ, Output, or Debugging question types, provide EXACTLY 4 options.
8. Provide a clear, educational explanation for the correct answer. Focus on placement preparation. Do not make unsupported company-specific claims (e.g., "Amazon asked this exactly"). Use "Placement-style Java question." instead.

OUTPUT FORMAT:
You MUST return ONLY a valid JSON object matching this schema. Do NOT include markdown code blocks (```json ... ```) or any other text.

{{
    "questionId": "tech_q_<random_hex>",
    "language": "java",
    "topic": "{topic}",
    "difficulty": "{difficulty.value}",
    "questionType": "{question_type.value}",
    "question": "<The question text. Be clear and specific.>",
    "codeSnippet": "<Optional Java code block if the question requires analyzing code. Use null if not applicable.>",
    "options": ["<Option 1>", "<Option 2>", "<Option 3>", "<Option 4>"],
    "correctOption": <Integer 0-3 representing the index of the correct option in the options array>,
    "explanation": "<Detailed explanation of why the correct option is right and others are wrong.>"
}}
"""
    return prompt
