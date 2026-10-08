"""
ARENA Module Test Script - ASCII only for Windows cmd compatibility
Tests: Communication, Aptitude, Technical, Assessment endpoints
"""
import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://localhost:8000/api"
TOKEN = "Bearer local-dev-token-test_uid_001"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": TOKEN,
}

def api_call(method, path, body=None, timeout=120):
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, json.loads(raw)
    except urllib.error.HTTPError as e:
        body_text = e.read().decode("utf-8", errors="replace")
        try:
            return e.code, json.loads(body_text)
        except:
            return e.code, {"raw": body_text}
    except Exception as ex:
        return 0, {"error": str(ex)}

def section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")

def ok(msg): print(f"  [OK] {msg}")
def fail(msg): print(f"  [FAIL] {msg}")
def info(msg): print(f"  [INFO] {msg}")

# HEALTH CHECK
section("HEALTH CHECK")
status, data = api_call("GET", "/health")
if status == 200:
    ok(f"Backend healthy: {data}")
else:
    fail(f"Backend not healthy: {status} {data}")
    sys.exit(1)

# MODULE 1: COMMUNICATION
section("COMMUNICATION MODULE")
info("Testing: POST /v1/communication/chat (calls Ollama - may take 60-120s)")
status, data = api_call("POST", "/v1/communication/chat", {
    "message": "Hello! I want to practice my communication skills for placement interview.",
    "mode": "general",
    "session_id": "test_session_001",
    "history": []
}, timeout=150)
if status == 200:
    ai_response = data.get("message", "")
    if ai_response and len(ai_response) > 10:
        ok(f"COMMUNICATION WORKING - AI responded ({len(ai_response)} chars)")
        ok(f"Preview: {ai_response[:200]}")
    else:
        fail(f"Response was empty or too short: {data}")
elif status == 503:
    fail(f"Ollama unavailable: {data.get('detail', data)}")
elif status == 401:
    fail(f"Auth error: {data.get('detail', data)}")
else:
    fail(f"HTTP {status}: {data}")

# MODULE 2: APTITUDE
section("APTITUDE MODULE")
info("Testing: POST /v1/aptitude/start (calls Ollama - may take 60-120s)")
status, data = api_call("POST", "/v1/aptitude/start", {
    "uid": "test_uid_001",
    "category": "quantitative",
    "topic": "Profit and Loss",
    "difficulty": "easy",
    "num_questions": 3
}, timeout=150)

aptitude_ok = False
if status == 200:
    questions = data.get("questions", [])
    session_id = data.get("session_id", "")
    ok(f"Session created: {session_id}")
    ok(f"Questions received: {len(questions)}")
    if questions:
        q0 = questions[0]
        ok(f"Q1 ID: {q0.get('question_id')}")
        ok(f"Q1 Text: {str(q0.get('question', ''))[:120]}")
        ok(f"Q1 Options count: {len(q0.get('options', []))}")
        aptitude_ok = True
        
        # Test complete session
        info("Testing: POST /v1/aptitude/complete")
        answers = {q["question_id"]: 0 for q in questions}
        status2, data2 = api_call("POST", "/v1/aptitude/complete", {
            "uid": "test_uid_001",
            "session_id": session_id,
            "category": "quantitative",
            "difficulty": "easy",
            "questions": questions,
            "answers": answers
        })
        if status2 == 200:
            ok(f"APTITUDE COMPLETE WORKING - score={data2.get('score')}, accuracy={data2.get('accuracy')}%")
        else:
            fail(f"Complete failed: HTTP {status2}: {data2}")
    else:
        fail("No questions returned!")
elif status == 400:
    fail(f"Validation error: {data.get('detail', data)}")
elif status == 503:
    fail(f"Ollama unavailable: {data.get('detail', data)}")
else:
    fail(f"HTTP {status}: {data}")

# MODULE 3: TECHNICAL - C
section("TECHNICAL MODULE")
info("Testing: GET /v1/technical/modules")
status, data = api_call("GET", "/v1/technical/modules")
if status == 200:
    modules = data
    ok(f"Modules returned: {len(modules)}")
    c_mod = next((m for m in modules if m.get("language") == "c"), None)
    if c_mod:
        ok(f"C module found: {c_mod.get('title')}")
    else:
        fail("C module NOT found in modules list!")
else:
    fail(f"Modules fetch failed: HTTP {status}: {data}")

info("Testing: POST /v1/technical/sessions/start (C - Basics, 3 questions)")
status, data = api_call("POST", "/v1/technical/sessions/start", {
    "language": "c",
    "topic": "Basics",
    "difficulty": "easy",
    "count": 3
}, timeout=300)

if status == 200:
    session_id = data.get("sessionId", "")
    questions = data.get("questions", [])
    ok(f"C session started: {session_id}")
    ok(f"Questions: {len(questions)}")
    if questions:
        q0 = questions[0]
        ok(f"Q1: {str(q0.get('question', ''))[:120]}")
        ok(f"Q1 options: {q0.get('options')}")
        
        # Submit an answer
        q_id = q0.get("questionId")
        info(f"Testing: POST /v1/technical/sessions/{session_id}/answer")
        status2, data2 = api_call("POST", f"/v1/technical/sessions/{session_id}/answer", {
            "questionId": q_id,
            "selectedOption": 0
        })
        if status2 == 200:
            ok(f"Answer submitted: isCorrect={data2.get('isCorrect')}, correctOption={data2.get('correctOption')}")
        else:
            fail(f"Answer submit failed: HTTP {status2}: {data2}")
        
        # Complete session
        info(f"Testing: POST /v1/technical/sessions/{session_id}/complete")
        status3, data3 = api_call("POST", f"/v1/technical/sessions/{session_id}/complete", {})
        if status3 == 200:
            ok(f"TECHNICAL C WORKING - score={data3.get('score')}/{data3.get('totalQuestions')}, accuracy={data3.get('accuracy')}%")
        else:
            fail(f"Complete failed: HTTP {status3}: {data3}")
else:
    fail(f"Technical C session failed: HTTP {status}: {data}")

# Python (second subject)
info("Testing: POST /v1/technical/sessions/start (Python - Lists)")
status, data = api_call("POST", "/v1/technical/sessions/start", {
    "language": "python",
    "topic": "Lists",
    "difficulty": "easy",
    "count": 2
}, timeout=300)
if status == 200:
    ok(f"TECHNICAL PYTHON WORKING: session={data.get('sessionId')}, {len(data.get('questions',[]))} questions")
else:
    fail(f"Technical Python failed: HTTP {status}: {data}")

# MODULE 4: ASSESSMENT
section("ASSESSMENT MODULE")
info("Testing: GET /v1/assessments")
status, data = api_call("GET", "/v1/assessments")
if status == 200:
    assessments = data
    ok(f"Assessments loaded: {len(assessments)}")
    if assessments:
        a0 = assessments[0]
        aid = a0.get("assessmentId")
        ok(f"Assessment: {a0.get('title')} [{aid}]")
        
        # Start session
        info(f"Testing: POST /v1/assessments/{aid}/sessions")
        status2, data2 = api_call("POST", f"/v1/assessments/{aid}/sessions")
        if status2 == 200:
            session_id = data2.get("sessionId")
            questions = data2.get("questions", [])
            ok(f"Session started: {session_id}")
            ok(f"Questions: {len(questions)}")
            
            if questions:
                q0 = questions[0]
                qid = q0.get("questionId")
                
                # Save answer
                info(f"Testing: POST /v1/assessments/sessions/{session_id}/answers")
                status3, data3 = api_call("POST", f"/v1/assessments/sessions/{session_id}/answers", {
                    "sessionId": session_id,
                    "questionId": qid,
                    "selectedOption": 0,
                    "state": "answered"
                })
                if status3 == 200:
                    ok("Answer saved successfully")
                else:
                    fail(f"Answer save failed: HTTP {status3}: {data3}")
                
                # Submit
                info(f"Testing: POST /v1/assessments/sessions/{session_id}/submit")
                status4, data4 = api_call("POST", f"/v1/assessments/sessions/{session_id}/submit")
                if status4 == 200:
                    ok(f"Assessment submitted: status={data4.get('status')}")
                    meta = data4.get("metadata") or {}
                    result_id = meta.get("resultId", "")
                    if result_id:
                        ok(f"Result ID: {result_id}")
                        
                        # Get result
                        info(f"Testing: GET /v1/assessments/results/{result_id}")
                        status5, data5 = api_call("GET", f"/v1/assessments/results/{result_id}")
                        if status5 == 200:
                            ok(f"ASSESSMENT WORKING - score={data5.get('score')}/{data5.get('maxScore')}, passed={data5.get('passed')}")
                        else:
                            fail(f"Result fetch failed: HTTP {status5}: {data5}")
                    else:
                        fail(f"No resultId in metadata: {meta}")
                else:
                    fail(f"Submit failed: HTTP {status4}: {data4}")
        elif status2 == 401:
            fail(f"Auth error (401): {data2.get('detail', data2)}")
        else:
            fail(f"Session start failed: HTTP {status2}: {data2}")
    else:
        fail("No assessments returned!")
elif status == 401:
    fail(f"Auth error (401): {data.get('detail', data)}")
else:
    fail(f"Assessments fetch failed: HTTP {status}: {data}")

print(f"\n{'='*60}")
print("  TEST COMPLETE")
print(f"{'='*60}\n")
