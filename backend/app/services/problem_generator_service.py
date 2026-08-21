import json
import logging
import uuid
import re
from typing import Dict, Any

from app.schemas.puzzle import ProblemGenerationRequest, PuzzleProblem, PuzzleConstraint, PuzzleExample
from app.services.gemini_service import gemini_service
from app.services.prompts.problem_generator import build_problem_generation_prompt
from app.services.puzzle_service import puzzle_service

logger = logging.getLogger(__name__)

class ProblemGeneratorService:
    async def generate_problem(self, request: ProblemGenerationRequest) -> PuzzleProblem:
        max_retries = 3
        
        system_prompt = build_problem_generation_prompt(
            category=request.category,
            difficulty=request.difficulty,
            problem_type=request.problemType,
            language=request.language,
            topic=request.topic
        )
        
        message = "Generate the programming problem exactly as specified."
        
        for attempt in range(max_retries):
            try:
                # 1. Call Gemini for JSON
                raw_json = await gemini_service.generate_json_response(
                    system_instruction=system_prompt,
                    message=message
                )
                
                # Clean up if Gemini accidentally wrapped it in markdown
                if raw_json.startswith("```json"):
                    raw_json = raw_json[7:-3]
                elif raw_json.startswith("```"):
                    raw_json = raw_json[3:-3]
                raw_json = raw_json.strip()
                
                # 2. Parse JSON
                data = json.loads(raw_json)
                
                # 3. Validate
                problem = self._validate_and_build_problem(data, request)
                
                # 4. Duplicate Check
                if self._is_duplicate(problem.title):
                    logger.warning(f"Duplicate problem detected: {problem.title}. Retrying...")
                    continue
                    
                # 5. Save and Return
                puzzle_service.add_problem(problem)
                return problem

            except Exception as e:
                logger.error(f"Generation attempt {attempt + 1} failed: {e}")
                
        raise ValueError("Unable to generate a valid problem right now. Please try again.")

    def _validate_and_build_problem(self, data: Dict[str, Any], req: ProblemGenerationRequest) -> PuzzleProblem:
        required_keys = [
            "title", "slug", "category", "difficulty", "problemType",
            "description", "inputFormat", "outputFormat", "constraints", "examples"
        ]
        
        for k in required_keys:
            if k not in data or not data[k]:
                raise ValueError(f"Missing required field in AI output: {k}")
                
        if len(data["examples"]) == 0:
            raise ValueError("No examples provided.")
            
        # Build examples
        examples = []
        for ex in data["examples"]:
            if "input" not in ex or "output" not in ex:
                raise ValueError("Example missing input or output.")
            examples.append(PuzzleExample(
                input=str(ex["input"]),
                output=str(ex["output"]),
                explanation=ex.get("explanation", None)
            ))
            
        # Build constraints
        constraints = [PuzzleConstraint(value=str(c)) for c in data["constraints"]]
        
        problem_id = f"ai_gen_{uuid.uuid4().hex[:12]}"
        
        return PuzzleProblem(
            problemId=problem_id,
            title=data["title"],
            slug=data["slug"],
            difficulty=data["difficulty"],
            category=data["category"],
            description=data["description"],
            constraints=constraints,
            inputFormat=data["inputFormat"],
            outputFormat=data["outputFormat"],
            examples=examples,
            supportedLanguages=["python", "java", "cpp", "c"],
            status="published",
            sourceType="ai_generated",
            tags=data.get("tags", []),
            expectedComplexity=data.get("expectedComplexity", None),
            functionSignature=data.get("functionSignature", None)
        )

    def _is_duplicate(self, title: str) -> bool:
        # Simple duplicate detection by title
        existing = puzzle_service.get_all_problems()
        normalized_title = re.sub(r'[^a-zA-Z0-9]', '', title.lower())
        for p in existing:
            if re.sub(r'[^a-zA-Z0-9]', '', p.title.lower()) == normalized_title:
                return True
        return False

problem_generator_service = ProblemGeneratorService()
