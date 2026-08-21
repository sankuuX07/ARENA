from typing import Dict, Any

LANGUAGE_CONFIG: Dict[str, Dict[str, Any]] = {
    "python": {
        "runtime": "python:3.10-slim",
        "extension": ".py",
        "compileRequired": False,
        "run_command": "python {filename}"
    },
    "java": {
        "runtime": "openjdk:17-slim",
        "extension": ".java",
        "compileRequired": True,
        "compile_command": "javac {filename}",
        "run_command": "java {main_class}"
    },
    "cpp": {
        "runtime": "gcc:latest",
        "extension": ".cpp",
        "compileRequired": True,
        "compile_command": "g++ -O2 -o executable {filename}",
        "run_command": "./executable"
    },
    "c": {
        "runtime": "gcc:latest",
        "extension": ".c",
        "compileRequired": True,
        "compile_command": "gcc -O2 -o executable {filename}",
        "run_command": "./executable"
    }
}
