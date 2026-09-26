import os
import glob
import re

backend_dir = r"c:\Users\sansk\OneDrive\Desktop\ARENA\backend\app"
endpoints = [
    "technical.py",
    "technical_c.py",
    "technical_cpp.py",
    "technical_cs_core.py",
    "technical_java.py",
    "technical_python.py"
]

for ep in endpoints:
    path = os.path.join(backend_dir, "api", "v1", "endpoints", ep)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Clean up schemas
    content = re.sub(r'from app\.schemas\.technical import \([\s\S]*?\)', 
        'from app.schemas.technical import (\n    ClientTechnicalSession, ClientTechnicalQuestion, TechnicalAnswerRequest, TechnicalAnswerResponse, TechnicalSession, TechnicalResult,\n    TechnicalLanguage, TechnicalDifficulty, TechnicalQuestionType, TechnicalModule, TechnicalTopic, CSSubject, CSTopic\n)', content)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Imports fixed.")
