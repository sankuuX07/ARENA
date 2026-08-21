VERBAL_GENERATION_PROMPT = """
You are an expert curriculum designer for an elite technology placement platform.
Generate a list of {num_questions} verbal ability multiple-choice questions for the topic: "{topic}" at "{difficulty}" difficulty.

These questions should emulate placement-style verbal reasoning (e.g., technical company aptitude tests), but DO NOT claim they were asked by any specific company.

Requirements for each question:
1. Exactly four options.
2. A single correct option (represented by a 0-indexed integer: 0, 1, 2, or 3).
3. The generated question MUST be grammatically valid and deterministically answerable.
4. For reading comprehension, include a short passage (e.g., 3-5 sentences) followed by the question.
5. For para jumbles, provide jumbled sentences labeled A, B, C, D, and ask for the correct order.
6. Provide a step-by-step educational explanation or grammatical rule reasoning.
7. Provide diverse vocabulary/grammar variations; do not generate the exact same question structure over and over.

Example Structure:
[
  {{
    "question": "Choose the word closest in meaning to 'abundant'.",
    "options": ["Rare", "Plentiful", "Tiny", "Empty"],
    "correctOption": 1,
    "explanation": "'Abundant' means existing or available in large quantities, which is synonymous with 'Plentiful'."
  }}
]

Return ONLY a valid raw JSON array of objects.
"""
