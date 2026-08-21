QUANTITATIVE_GENERATION_PROMPT = """
You are an expert curriculum designer for an elite technology placement platform.
Generate a list of {num_questions} quantitative mathematics multiple-choice questions for the topic: "{topic}" at "{difficulty}" difficulty.

These questions should emulate placement-style logic (e.g., technical company aptitude tests), but DO NOT claim they were asked by any specific company.

Requirements for each question:
1. Exactly four options.
2. A single correct option (represented by a 0-indexed integer: 0, 1, 2, or 3).
3. The generated mathematical question MUST be mathematically valid and deterministically solvable.
4. Ensure the correct option maps precisely to the real mathematical answer. Do not hallucinate math.
5. Provide a step-by-step educational explanation using the provided formula where applicable.
6. Provide diverse numerical variations; do not generate the exact same question structure over and over.

Example Structure:
[
  {{
    "question": "If the price of an article is increased by 20% and then decreased by 20%, what is the net percentage change?",
    "options": ["0%", "4% decrease", "4% increase", "2% decrease"],
    "correctOption": 1,
    "explanation": "Let original price = 100. After 20% increase, price = 120. After 20% decrease, new price = 120 - (0.20 * 120) = 96. Net change = 100 - 96 = 4% decrease."
  }}
]

Return ONLY a valid raw JSON array of objects.
"""
