import asyncio
import httpx

async def test():
    async with httpx.AsyncClient(base_url="http://localhost:8000/api/v1", timeout=120.0) as client:
        headers={"Authorization": "Bearer local-dev-token-test"}
        print("Testing Aptitude...")
        r = await client.post("/aptitude/start", json={"uid": "test", "category": "quantitative", "difficulty": "medium", "num_questions": 2}, headers=headers)
        print(r.status_code, r.text[:200])

        print("Testing C Programming...")
        r = await client.post("/technical/c/sessions/start", json={"topic": "Data Types", "difficulty": "easy", "questionType": "mcq", "count": 2}, headers=headers)
        print(r.status_code, r.text[:200])

        print("Testing Interview...")
        r = await client.post("/interviews/sessions", json={"mode": "technical", "topic": "React JS"}, headers=headers)
        print(r.status_code, r.text[:200])
        if r.status_code == 200:
            sid = r.json()["sessionId"]
            r2 = await client.post(f"/interviews/sessions/{sid}/respond", json={"content": "I am ready."}, headers=headers)
            print("Interview Turn:", r2.status_code, r2.text[:200])

            r3 = await client.post(f"/interviews/sessions/{sid}/evaluate", headers=headers)
            print("Interview Evaluate:", r3.status_code, r3.text[:200])

asyncio.run(test())
