LOGICAL_GENERATION_PROMPT = """
You are an expert curriculum designer for an elite technology placement platform.
Generate a list of {num_questions} logical reasoning multiple-choice questions for the topic: "{topic}" at "{difficulty}" difficulty.

These questions should emulate placement-style logical and analytical reasoning (e.g., technical company aptitude tests), but DO NOT claim they were asked by any specific company.

Requirements for each question:
1. Exactly four options.
2. A single correct option (represented by a 0-indexed integer: 0, 1, 2, or 3).
3. The generated question MUST be logically sound, with NO contradictory conditions.
4. There must be exactly one objectively defensible answer. Do not generate ambiguous or highly subjective situations.
5. Provide a step-by-step educational explanation explaining the logical deduction clearly.
6. Provide diverse question structures and relationships; do not just swap names or numbers in the same template.
7. Include a `validation_reasoning` string field. In this field, you must write out the logical proof or sequence of steps that strictly proves the answer is correct before finalizing the `correctOption` and `explanation`. This ensures self-validation. 

Example Structure:
[
  {{
    "question": "Find the next number in the series: 2, 6, 12, 20, 30, ?",
    "options": ["36", "40", "42", "44"],
    "correctOption": 2,
    "validation_reasoning": "Differences are: 6-2=4, 12-6=6, 20-12=8, 30-20=10. The next difference should be 12. So, 30 + 12 = 42. Option 3 (index 2) is 42.",
    "explanation": "Given series: 2, 6, 12, 20, 30. The differences between consecutive terms are 4, 6, 8, 10. Following this pattern, the next difference must be 12. Therefore, the next term is 30 + 12 = 42."
  }}
]

Return ONLY a valid raw JSON array of objects.
"""
