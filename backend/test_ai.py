import asyncio
import os

from app.services.aptitude_service import aptitude_service
from app.schemas.aptitude import AptitudeStartRequest

from app.services.c_service import c_service
from app.schemas.technical import TechnicalDifficulty, TechnicalQuestionType

from app.services.interview_service import interview_service
from app.schemas.interview import InterviewConfig

from app.services.communication_service import communication_service
from app.schemas.communication import ChatMessageRequest

async def test_aptitude():
    try:
        print("Testing Aptitude...")
        req = AptitudeStartRequest(
            category="quantitative",
            topic="Number System",
            difficulty="Medium",
            num_questions=5
        )
        res = await aptitude_service.start_session(req)
        print(f"Aptitude SUCCESS: Got {len(res.questions)} questions.")
        return True
    except Exception as e:
        print(f"Aptitude FAILED: {e}")
        return False

async def test_technical():
    try:
        print("Testing Technical (C)...")
        res = await c_service.start_session(
            uid="test_user",
            topic="c_intro",
            difficulty=TechnicalDifficulty.medium,
            q_type=TechnicalQuestionType.mcq,
            count=5
        )
        print(f"Technical SUCCESS: Got {res.questionCount} questions.")
        return True
    except Exception as e:
        print(f"Technical FAILED: {e}")
        return False

async def test_interview():
    try:
        print("Testing Interview...")
        req = InterviewConfig(
            mode="technical",
            difficulty="medium",
            durationMinutes=30,
            maxQuestions=5,
            responseMode="text",
            topic="Python"
        )
        session = await interview_service.start_session("test_user", req)
        
        res = await interview_service.submit_response("test_user", session.sessionId, "text", "Hi, I am ready for the interview.")
        print(f"Interview SUCCESS: AI replied '{res.interviewerMessage.content}'")
        return True
    except Exception as e:
        print(f"Interview FAILED: {e}")
        return False

async def test_communication():
    try:
        print("Testing Communication...")
        req = ChatMessageRequest(
            message="Hello, how can I improve my communication skills?",
            mode="general"
        )
        res = await communication_service.process_chat(req)
        print(f"Communication SUCCESS: AI replied '{res.message}'")
        return True
    except Exception as e:
        print(f"Communication FAILED: {e}")
        return False

async def main():
    a = await test_aptitude()
    b = await test_technical()
    c = await test_interview()
    d = await test_communication()
    
if __name__ == "__main__":
    asyncio.run(main())
