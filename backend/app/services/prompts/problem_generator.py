def build_problem_generation_prompt(
    category: str,
    difficulty: str,
    problem_type: str,
    language: str,
    topic: str = None
) -> str:
    topic_clause = f"The specific topic or theme is: '{topic}'." if topic else ""
    return f"""
You are an expert algorithm problem designer for ARENA, a student placement-preparation platform.
Your task is to generate an original, coherent, and solvable programming problem.

Requested Parameters:
- Category: {category}
- Difficulty: {difficulty} (Must truly reflect this difficulty)
- Problem Type: {problem_type}
- Target Language: {language}
{topic_clause}

Output Format: 
You MUST return ONLY a valid JSON object matching this exact structure, with no markdown code blocks outside the JSON:

{{
  "title": "Clear, engaging problem title",
  "slug": "url-safe-lowercase-slug",
  "category": "{category}",
  "difficulty": "{difficulty.lower()}",
  "problemType": "{problem_type}",
  "description": "Full markdown description. Explain the scenario clearly.",
  "inputFormat": "Explain how input is provided",
  "outputFormat": "Explain what should be returned/printed",
  "constraints": [
    "String constraint 1 (e.g. 1 <= N <= 10^5)",
    "String constraint 2"
  ],
  "examples": [
    {{
      "input": "...",
      "output": "...",
      "explanation": "..."
    }}
  ],
  "tags": ["tag1", "tag2"],
  "expectedComplexity": {{
    "time": "O(N)",
    "space": "O(1)"
  }},
  "functionSignature": {{
    "python": "def solve(nums):\\n    pass",
    "java": "class Solution {{\\n    public int solve(int[] nums) {{\\n        return 0;\\n    }}\\n}}",
    "cpp": "class Solution {{\\npublic:\\n    int solve(vector<int>& nums) {{\\n        return 0;\\n    }}\\n}};",
    "c": "int solve(int* nums, int numsSize) {{\\n    return 0;\\n}}"
  }}
}}

CRITICAL RULES:
1. EXAMPLES MUST BE 100% CORRECT AND CONSISTENT WITH THE DESCRIPTION.
2. Provide at least two examples.
3. Keep the problem language-agnostic but generate the function signatures for ALL four languages (python, java, cpp, c) in the `functionSignature` dictionary.
4. DO NOT copy directly from LeetCode/HackerRank. Create original placement-style phrasing.
5. The JSON must be perfectly parsable by Python's json.loads().
"""
