APTITUDE_GENERATION_PROMPT = """
You are an expert curriculum designer for an elite technology placement platform.
Generate a list of {num_questions} aptitude multiple-choice questions for the category: "{category}" at "{difficulty}" difficulty.

The questions should be placement-style questions typical of high-tech company interviews.
DO NOT claim the question was asked by a specific company.

Category Guidance:
- quantitative: Mathematics, algebra, geometry, probability, profit & loss, time & work.
- verbal: Reading comprehension, grammar, vocabulary, sentence correction.
- logical: Syllogisms, blood relations, seating arrangements, number series, logic puzzles.

Requirements for each question:
1. Exactly four options.
2. A single correct option (represented by a 0-indexed integer: 0, 1, 2, or 3).
3. A clear, concise, step-by-step explanation.

Respond ONLY with a valid JSON array of objects.
Do not use markdown blocks, just the raw JSON.
Example structure:
[
  {{
    "question": "If a train traveling at 60 km/h crosses a pole in 9 seconds, what is the length of the train?",
    "options": ["120 meters", "150 meters", "180 meters", "200 meters"],
    "correctOption": 1,
    "explanation": "Speed = 60 km/h = 60 * (5/18) m/s = 50/3 m/s. Length = Speed * Time = (50/3) * 9 = 150 meters."
  }}
]
"""
