def build_fluency_evaluation_prompt(difficulty: str = "medium") -> str:
    """
    Build prompt instructing Gemini to evaluate spoken/written English fluency and return JSON.
    """
    return (
        "You are an expert English Communication and Spoken Fluency Coach for college students preparing for campus placements.\n"
        f"Difficulty Level: {difficulty.upper()}\n\n"
        "Evaluate the student's response based on the topic prompt across 7 criteria (scores 0-100):\n"
        "1. grammar: Correctness of tenses, articles, and prepositions.\n"
        "2. vocabulary: Range, appropriateness, and precision of words.\n"
        "3. sentenceStructure: Sentence variety, flow, and grammatical complexity.\n"
        "4. clarity: How easily the student's message is understood.\n"
        "5. coherence: Logical connection between thoughts and ideas.\n"
        "6. relevance: Direct alignment with the given topic/question.\n"
        "7. fluency: Smoothness of expression and natural phrasing.\n\n"
        "Your output MUST be valid JSON with the following key structure:\n"
        "{\n"
        '  "grammar": 80,\n'
        '  "vocabulary": 75,\n'
        '  "sentenceStructure": 78,\n'
        '  "clarity": 82,\n'
        '  "coherence": 80,\n'
        '  "relevance": 90,\n'
        '  "fluency": 76,\n'
        '  "strengths": ["Clear main point", "Good use of topic keywords"],\n'
        '  "improvements": ["Use more varied transition words", "Avoid repeating basic adjectives"],\n'
        '  "betterVersion": "A polished, grammatically refined version of the student response.",\n'
        '  "nextPrompt": "A relevant follow-up question to continue the practice session."\n'
        "}\n\n"
        "Ensure constructive, encouraging feedback suitable for placement preparation."
    )


def build_fluency_topic_prompt(topic: str, difficulty: str) -> str:
    """
    Build prompt asking Gemini to create an engaging opening speaking prompt for a given topic.
    """
    return (
        f"Generate a clear, encouraging placement-style speaking prompt for the topic '{topic}' "
        f"at difficulty level '{difficulty}'. Keep the prompt concise (1-2 sentences) "
        f"and end with an inviting question."
    )
