from app.schemas.technical import TechnicalLanguage, TechnicalDifficulty, TechnicalQuestionType

def get_technical_question_prompt(
    language: TechnicalLanguage,
    topic: str,
    difficulty: TechnicalDifficulty,
    question_type: TechnicalQuestionType
) -> str:
    """
    Constructs a robust prompt for Gemini to generate a technical question.
    """
    
    prompt = f"""You are an expert technical interviewer and computer science professor at a top-tier university.
Your task is to generate ONE highly accurate, educational, and placement-oriented technical question.

CONTEXT:
Language/Subject: {language.value.upper()}
Topic: {topic}
Difficulty: {difficulty.value.upper()}
Question Type: {question_type.value.upper()}

RULES:
1. The question MUST be precisely tailored to the requested Language and Topic.
2. The difficulty MUST match the requested level.
3. The content must be unambiguous and technically flawless. Do NOT generate incorrect syntax or API behavior.
4. For MCQ, Output, or Debugging, provide exactly 4 options.
5. Provide a clear, educational explanation for the correct answer.

OUTPUT FORMAT:
You MUST return ONLY a valid JSON object matching this schema. Do NOT include markdown code blocks (```json ... ```) or any other text.

{{
    "questionId": "tech_q_<random_hex>",
    "language": "{language.value}",
    "topic": "{topic}",
    "difficulty": "{difficulty.value}",
    "questionType": "{question_type.value}",
    "question": "<The question text. Be clear and specific.>",
    "codeSnippet": "<Optional code block if the question requires analyzing code. Use null if not applicable.>",
    "options": ["<Option 1>", "<Option 2>", "<Option 3>", "<Option 4>"],
    "correctOption": <Integer 0-3 representing the index of the correct option in the options array>,
    "explanation": "<Detailed explanation of why the correct option is right and others are wrong.>"
}}
"""
    return prompt
