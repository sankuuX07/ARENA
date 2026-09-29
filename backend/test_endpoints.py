import asyncio
import httpx

API_BASE = "http://localhost:8000/api/v1"
HEADERS = {"Authorization": "Bearer local-dev-token-test1234"}

async def test_aptitude(client):
    try:
        print("Testing Aptitude...")
        res = await client.post(f"{API_BASE}/aptitude/sessions/start", json={
            "category": "quantitative",
            "topic": "Number System",
            "difficulty": "Medium",
            "num_questions": 3
        })
        print(f"Aptitude: {res.status_code}")
        if res.status_code != 200:
            print(res.text)
    except Exception as e:
        print(f"Aptitude failed: {e}")

async def test_technical(client):
    try:
        print("Testing Technical (C)...")
        res = await client.post(f"{API_BASE}/technical/c/sessions/start", json={
            "topic": "c_intro",
            "difficulty": "medium",
            "questionType": "mcq",
            "count": 3
        })
        print(f"Technical (C): {res.status_code}")
        if res.status_code != 200:
            print(res.text)
    except Exception as e:
        print(f"Technical failed: {e}")

async def test_interview(client):
    try:
        print("Testing Interview...")
        res = await client.post(f"{API_BASE}/interviews/start", json={
            "mode": "technical",
            "difficulty": "medium",
            "durationMinutes": 30,
            "maxQuestions": 5,
            "responseMode": "text",
            "topic": "Python"
        })
        print(f"Interview Start: {res.status_code}")
        if res.status_code != 200:
            print(res.text)
    except Exception as e:
        print(f"Interview failed: {e}")

async def test_communication(client):
    try:
        print("Testing Communication...")
        res = await client.post(f"{API_BASE}/communication/chat", json={
            "message": "Hello, how can I improve my communication skills?",
            "mode": "general"
        })
        print(f"Communication: {res.status_code}")
        if res.status_code != 200:
            print(res.text)
    except Exception as e:
        print(f"Communication failed: {e}")

async def test_resume(client):
    try:
        print("Testing Resume...")
        res = await client.post(f"{API_BASE}/resume-improvement/improve", json={
            "resumeContent": "My name is student and I am good at python",
            "section": "Professional Summary"
        })
        print(f"Resume: {res.status_code}")
        if res.status_code != 200:
            print(res.text)
    except Exception as e:
        print(f"Resume failed: {e}")

async def test_problem_generator(client):
    try:
        print("Testing Problem Generator...")
        res = await client.post(f"{API_BASE}/puzzles/generate", json={
            "difficulty": "easy",
            "topic": "arrays"
        })
        print(f"Problem Generator: {res.status_code}")
        if res.status_code != 200:
            print(res.text)
    except Exception as e:
        print(f"Problem Generator failed: {e}")

async def main():
    async with httpx.AsyncClient(headers=HEADERS, timeout=120.0) as client:
        await test_aptitude(client)
        await test_technical(client)
        await test_interview(client)
        await test_communication(client)
        await test_resume(client)
        await test_problem_generator(client)

if __name__ == "__main__":
    asyncio.run(main())
