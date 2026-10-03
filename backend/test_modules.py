# -*- coding: utf-8 -*-
"""
ARENA Module Diagnostic - ASCII output only
"""
import sys
import os
os.environ['PYTHONIOENCODING'] = 'utf-8'
sys.stdout.reconfigure(encoding='utf-8')

import urllib.request
import urllib.error
import json

BASE = "http://localhost:8000/api/v1"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer local-dev-token-testuid123"
}

def post(path, body, timeout=180):
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(f"{BASE}{path}", data=data, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body_err = e.read().decode("utf-8", errors="replace")
        return e.code, body_err
    except Exception as ex:
        return 0, str(ex)

def get(path, timeout=30):
    req = urllib.request.Request(f"{BASE}{path}", headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body_err = e.read().decode("utf-8", errors="replace")
        return e.code, body_err
    except Exception as ex:
        return 0, str(ex)

results = {}

print("=" * 60)
print("ARENA MODULE DIAGNOSTIC")
print("=" * 60)

# ── COMMUNICATION ──────────────────────────────────────────
print("\n[1] COMMUNICATION MODULE")
status, res = post("/v1/communication/chat", {
    "message": "Hello! How can I improve my communication skills?",
    "mode": "general",
    "history": []
})
if status == 200 and isinstance(res, dict):
    ai_msg = res.get("message", "")[:100]
    print(f"  PASS - Status {status}")
    print(f"  AI: {ai_msg}")
    results["communication"] = "PASS"
else:
    print(f"  FAIL - Status {status}: {str(res)[:300]}")
    results["communication"] = f"FAIL ({status})"

# ── APTITUDE ───────────────────────────────────────────────
print("\n[2] APTITUDE MODULE")
status, res = post("/v1/aptitude/start", {
    "uid": "testuid123",
    "category": "quantitative",
    "difficulty": "easy",
    "num_questions": 2,
    "topic": "Number System"
})
if status == 200 and isinstance(res, dict):
    qcount = len(res.get("questions", []))
    session_id = res.get("session_id")
    print(f"  PASS - Session: {session_id}, Questions: {qcount}")
    if qcount > 0:
        q = res["questions"][0]
        print(f"  First Q: {str(q.get('question','?'))[:80]}")
        # Complete session
        answers = {q["question_id"]: 0 for q in res["questions"]}
        sc2, r2 = post("/v1/aptitude/complete", {
            "uid": "testuid123",
            "session_id": session_id,
            "category": "quantitative",
            "difficulty": "easy",
            "questions": res["questions"],
            "answers": answers
        })
        if sc2 == 200 and isinstance(r2, dict):
            print(f"  COMPLETE PASS - Score: {r2.get('score')}/{r2.get('total_questions')}, Accuracy: {r2.get('accuracy')}%")
            results["aptitude"] = "PASS"
        else:
            print(f"  COMPLETE FAIL - {sc2}: {str(r2)[:200]}")
            results["aptitude"] = f"PASS (start) / FAIL complete ({sc2})"
else:
    print(f"  FAIL - Status {status}: {str(res)[:300]}")
    results["aptitude"] = f"FAIL ({status})"

# ── TECHNICAL (C) ──────────────────────────────────────────
print("\n[3] TECHNICAL MODULE - C")
status, res = post("/v1/technical/c/sessions/start", {
    "topic": "pointers",
    "difficulty": "easy",
    "questionType": "mcq",
    "count": 2
})
if status == 200 and isinstance(res, dict):
    qcount = res.get("questionCount", 0)
    sid = res.get("sessionId")
    print(f"  PASS - Session: {sid}, Questions: {qcount}")
    if qcount > 0 and res.get("questions"):
        q0 = res["questions"][0]
        print(f"  First Q: {str(q0.get('question','?'))[:80]}")
        opts = q0.get('options', [])
        print(f"  Options: {opts}")
    results["technical_c"] = "PASS"
else:
    print(f"  FAIL - Status {status}: {str(res)[:300]}")
    results["technical_c"] = f"FAIL ({status})"

# ── TECHNICAL (Python) ─────────────────────────────────────
print("\n[3b] TECHNICAL MODULE - Python")
status, res = post("/v1/technical/python/sessions/start", {
    "topic": "functions",
    "difficulty": "easy",
    "questionType": "mcq",
    "count": 2
})
if status == 200 and isinstance(res, dict):
    qcount = res.get("questionCount", 0)
    print(f"  PASS - Session: {res.get('sessionId')}, Questions: {qcount}")
    results["technical_python"] = "PASS"
else:
    print(f"  FAIL - Status {status}: {str(res)[:300]}")
    results["technical_python"] = f"FAIL ({status})"

# ── ASSESSMENT ─────────────────────────────────────────────
print("\n[4] ASSESSMENT MODULE")
sc_list, r_list = get("/v1/assessments")
if sc_list == 200 and isinstance(r_list, list):
    print(f"  LIST PASS - {len(r_list)} assessments")
    if r_list:
        a = r_list[0]
        aid = a.get("id") or a.get("assessment_id")
        print(f"  First: {str(a.get('title','?'))!r} (id={aid})")
        sc_s, r_s = post(f"/v1/assessments/{aid}/sessions", {})
        if sc_s == 200 and isinstance(r_s, dict):
            qs = r_s.get("questions", [])
            sid = r_s.get("id") or r_s.get("sessionId") or r_s.get("session_id")
            print(f"  START PASS - Session: {sid}, Questions: {len(qs)}")
            results["assessment"] = "PASS"
        else:
            print(f"  START FAIL - {sc_s}: {str(r_s)[:200]}")
            results["assessment"] = f"PASS (list) / FAIL start ({sc_s})"
    else:
        print("  No assessments available")
        results["assessment"] = "PASS (list empty)"
else:
    print(f"  LIST FAIL - {sc_list}: {str(r_list)[:300]}")
    results["assessment"] = f"FAIL ({sc_list})"

# ── SUMMARY ────────────────────────────────────────────────
print("\n" + "=" * 60)
print("DIAGNOSTIC SUMMARY")
print("=" * 60)
for k, v in results.items():
    print(f"  {k:20s}: {v}")
