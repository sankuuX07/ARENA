from app.schemas.technical import TechnicalDifficulty, TechnicalQuestionType

def get_cs_core_question_prompt(
    subject: str,
    topic: str,
    difficulty: TechnicalDifficulty,
    question_type: TechnicalQuestionType
) -> str:
    """
    Constructs a robust prompt for Gemini to generate a CS Core technical question.
    """
    
    prompt = f"""You are an expert computer science professor, systems architect, and technical interviewer at a top-tier university.
Your task is to generate ONE highly accurate, educational, and placement-oriented Computer Science question.

CONTEXT:
Subject: {subject}
Topic: {topic}
Difficulty: {difficulty.value.upper()}
Question Type: {question_type.value.upper()}

RULES:
1. The question MUST be precisely tailored to the requested Topic within the Subject.
2. The difficulty MUST match the requested level (e.g., Easy = definitions, Medium = applications, Hard = complex scenarios/math).
3. The content must be unambiguous and technically flawless. 
4. For Conceptual, MCQ, or Scenario-Based question types, provide EXACTLY 4 options.
5. Provide a clear, educational explanation for the correct answer. Focus on placement preparation. Do not make unsupported company-specific claims (e.g., "Amazon asked this exactly"). Use "Placement-style CS question." instead.
6. If Code is necessary to explain a concept, use generic pseudocode or standard language-agnostic representations unless specifically testing language-dependent OOP.

OUTPUT FORMAT:
You MUST return ONLY a valid JSON object matching this schema. Do NOT include markdown code blocks (```json ... ```) or any other text.

{{
    "questionId": "tech_q_<random_hex>",
    "language": "cs-core",
    "topic": "{topic}",
    "difficulty": "{difficulty.value}",
    "questionType": "{question_type.value}",
    "question": "<The question text. Be clear and specific.>",
    "codeSnippet": "<Optional pseudocode or block if the question requires analyzing structures. Use null if not applicable.>",
    "options": ["<Option 1>", "<Option 2>", "<Option 3>", "<Option 4>"],
    "correctOption": <Integer 0-3 representing the index of the correct option in the options array>,
    "explanation": "<Detailed explanation of why the correct option is right and others are wrong.>"
}}
"""
    return prompt
