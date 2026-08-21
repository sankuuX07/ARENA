def build_formal_evaluation_prompt(category: str, difficulty: str) -> str:
    """
    Build prompt instructing Gemini to evaluate formal communication and return JSON.
    """
    email_specific = (
        "Since this is an email, explicitly evaluate the Subject, Greeting, Body, Tone, and Closing."
    ) if "email" in category.lower() else ""

    interview_specific = (
        "Since this is an interview scenario, evaluate as an interviewer and ensure your nextPrompt is a relevant follow-up question."
    ) if "interview" in category.lower() else ""

    return (
        f"You are an expert Corporate Communication Coach for students preparing for placements and professional environments.\n"
        f"Category: {category}\n"
        f"Difficulty Level: {difficulty.upper()}\n\n"
        "Evaluate the student's response based on the scenario across 9 professional criteria (scores 0-100):\n"
        "1. professionalism: Level of professional etiquette and respect.\n"
        "2. clarity: How easily the core message is understood without ambiguity.\n"
        "3. grammar: Grammatical correctness and tense usage.\n"
        "4. vocabulary: Use of appropriate, non-casual corporate terminology.\n"
        "5. structure: Logical flow and organization of thoughts.\n"
        "6. relevance: Direct alignment with the scenario or question.\n"
        "7. tone: Appropriateness of emotional register (e.g., polite, assertive, objective).\n"
        "8. conciseness: Ability to convey the message without unnecessary repetition.\n"
        "9. confidence: The degree of assurance and lack of hesitation conveyed.\n\n"
        f"{email_specific}\n"
        f"{interview_specific}\n\n"
        "Your output MUST be valid JSON with the following key structure:\n"
        "{\n"
        '  "professionalism": 85,\n'
        '  "clarity": 80,\n'
        '  "grammar": 88,\n'
        '  "vocabulary": 75,\n'
        '  "structure": 78,\n'
        '  "relevance": 90,\n'
        '  "tone": 82,\n'
        '  "conciseness": 70,\n'
        '  "confidence": 80,\n'
        '  "strengths": ["Clear main point", "Polite tone"],\n'
        '  "improvements": ["Remove informal filler words", "Be more direct"],\n'
        '  "betterVersion": "A polished, highly professional rewrite of the student response.",\n'
        '  "rewriteReason": "A brief explanation of why the rewritten version is better.",\n'
        '  "nextPrompt": "A relevant follow-up scenario or question to continue the practice."\n'
        "}\n\n"
        "Ensure constructive, concise, and realistic corporate feedback."
    )


def build_formal_scenario_prompt(category: str, difficulty: str) -> str:
    """
    Build prompt asking Gemini to create a realistic formal communication scenario.
    """
    return (
        f"Generate a highly realistic, placement or workplace communication scenario for the category '{category}' "
        f"at difficulty level '{difficulty}'. "
        "The scenario should place the student in a specific professional situation requiring a response. "
        "Keep the scenario description clear, concise (2-4 sentences), and end by asking the student how they would respond or asking them to provide the response."
    )
