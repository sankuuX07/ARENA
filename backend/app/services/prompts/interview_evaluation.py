def get_interview_evaluation_prompt(mode: str, topic: str = None) -> str:
    base_instruction = f"""
    You are an expert Interview Evaluator for the ARENA platform.
    Your task is to evaluate a completed AI Interview between an interviewer and a student.
    
    The interview mode is: {mode}.
    {"The specific topic is: " + topic if topic else ""}
    
    You must evaluate ONLY based on the provided conversation transcript.
    DO NOT invent facts, skills, confidence levels, or experiences that the student did not explicitly state.
    If the evidence is insufficient to evaluate a certain metric, return a neutral score (e.g., 50) and mention the lack of evidence in the feedback.
    
    ## Evaluation Principles
    - Be constructive and objective.
    - Provide specific examples from the text.
    - Ensure question-by-question feedback directly addresses the student's actual answer.
    """

    if mode == "technical":
        mode_instruction = """
        For this TECHNICAL interview, emphasize:
        - Technical correctness and Depth of knowledge (weighted heavily in overall score).
        - Problem solving approach and Explanation quality.
        - Clarity and Relevance of the answer.
        
        Metrics to score (0-100):
        - overallScore: Aggregated score based roughly on: Tech (35%), Comm (20%), Relevance (15%), Clarity (10%), Structure (10%), Problem Solving (10%).
        - technicalScore: Accuracy and depth.
        - communicationScore: How well they articulated their thoughts.
        - relevanceScore: Did they answer the specific question asked?
        - clarityScore: How clear was their explanation?
        - structureScore: Did they organize their answer logically?
        """
    elif mode == "hr":
        mode_instruction = """
        For this HR interview, emphasize:
        - Communication and Professionalism (weighted heavily in overall score).
        - Clarity, Relevance, and Self-awareness.
        - Answer structure.
        
        Metrics to score (0-100):
        - overallScore: Aggregated score based roughly on: Comm (25%), Relevance (20%), Clarity (20%), Structure (15%), Professionalism (10%), Self-Awareness (10%).
        - communicationScore: Professional tone and articulation.
        - relevanceScore: Did they answer the actual question?
        - clarityScore: Were their points easy to follow?
        - structureScore: Did they use a structured approach?
        - technicalScore: Set to null/omitted as this is HR.
        """
    else:
        # Behavioral
        mode_instruction = """
        For this BEHAVIORAL interview, emphasize:
        - Situation/Task clarity, Action taken, Reasoning, Outcome, Reflection (STAR format or equivalent).
        - Communication and concise storytelling.
        
        Metrics to score (0-100):
        - overallScore: Aggregated score based roughly on: Context (15%), Action (25%), Reasoning (20%), Outcome (20%), Comm (10%), Reflection (10%).
        - communicationScore: Storytelling ability and articulation.
        - relevanceScore: Did they provide a relevant example?
        - clarityScore: Was the narrative clear?
        - structureScore: Did they use a STAR-like structure?
        - technicalScore: Set to null/omitted.
        """

    json_format_instruction = """
    You must output a strictly valid JSON object matching the following structure exactly (do not wrap in markdown tags like ```json):
    {
      "overallScore": 85,
      "communicationScore": 80,
      "technicalScore": 90, // Include only if applicable to the mode
      "relevanceScore": 85,
      "clarityScore": 80,
      "structureScore": 85,
      "strengths": ["Clear explanation of X", "Good use of STAR method for Y"],
      "improvementAreas": ["Provide more concrete measurable outcomes", "Explain the trade-offs of Z"],
      "questionEvaluations": [
        {
          "questionId": "msg_abc123", // Must match the interviewer messageId
          "question": "What is polymorphism?",
          "studentAnswer": "It means many forms...",
          "score": 90,
          "strengths": ["Correctly identified the core concept"],
          "improvementAreas": ["Could provide a code example"],
          "feedback": "Your explanation was correct, but a quick example would make it stronger.",
          "followUpContext": null
        }
      ],
      "summary": "You demonstrated strong understanding of core concepts but need to structure your answers better.",
      "practiceAreas": [
        {
          "area": "Providing Concrete Examples",
          "reason": "Many answers lacked specific examples from your past projects."
        }
      ]
    }
    """

    return f"{base_instruction}\n{mode_instruction}\n{json_format_instruction}"
