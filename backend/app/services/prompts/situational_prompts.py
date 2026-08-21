def build_situational_evaluation_prompt(category: str, difficulty: str) -> str:
    """
    Build prompt instructing Gemini to evaluate situational communication and return JSON.
    """
    return (
        f"You are an expert Corporate Communication Coach for students preparing for placements and professional environments.\n"
        f"Category: {category}\n"
        f"Difficulty Level: {difficulty.upper()}\n\n"
        "Evaluate the student's response to the given situation across 10 criteria (scores 0-100):\n"
        "1. relevance: Does the response adequately and directly address the core issue of the situation?\n"
        "2. clarity: How easily the message is understood without ambiguity.\n"
        "3. professionalism: Level of professional etiquette and respect.\n"
        "4. tone: Appropriateness of emotional register for the specific situation.\n"
        "5. appropriateness: Does the student act suitably for their assumed role in the situation?\n"
        "6. empathy: Does the student consider the other party's perspective (if applicable)?\n"
        "7. decisionMaking: Does the response reflect sound judgement and practical choices?\n"
        "8. problemHandling: How well does the student navigate conflict or difficulty?\n"
        "9. confidence: The degree of assurance and lack of hesitation conveyed.\n"
        "10. communicationQuality: Overall structural and grammatical quality of the response.\n\n"
        "Your output MUST be valid JSON with the following key structure:\n"
        "{\n"
        '  "relevance": 85,\n'
        '  "clarity": 80,\n'
        '  "professionalism": 88,\n'
        '  "tone": 75,\n'
        '  "appropriateness": 78,\n'
        '  "empathy": 90,\n'
        '  "decisionMaking": 82,\n'
        '  "problemHandling": 70,\n'
        '  "confidence": 80,\n'
        '  "communicationQuality": 85,\n'
        '  "strengths": ["Addresses the main problem", "Good professional tone"],\n'
        '  "improvements": ["Be more specific", "Consider the teammate\'s perspective"],\n'
        '  "betterResponse": "An improved, practical response demonstrating how they should have handled it.",\n'
        '  "followUp": "A relevant follow-up situation or question to continue the interactive practice."\n'
        "}\n\n"
        "Ensure constructive, concise, and realistic feedback."
    )


def build_situational_scenario_prompt(category: str, difficulty: str) -> str:
    """
    Build prompt asking Gemini to create a realistic situational communication scenario.
    """
    return (
        f"Generate a highly realistic, placement, academic, or workplace situational communication scenario for the category '{category}' "
        f"at difficulty level '{difficulty}'. "
        "The situation must require the student to decide what to say or how to respond. "
        "Keep the scenario description clear, concise (2-4 sentences). End by asking the student how they would respond."
    )
