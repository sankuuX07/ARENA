import subprocess
import logging

logger = logging.getLogger(__name__)

class DockerSandbox:
    """
    Abstration for the Docker execution sandbox.
    It checks for Docker availability on initialization.
    If unavailable, it returns a clear configuration error as mandated by Milestone 19.
    """
    def __init__(self):
        self.is_available = self._check_docker()

    def _check_docker(self) -> bool:
        try:
            result = subprocess.run(
                ["docker", "--version"],
                capture_output=True,
                text=True,
                timeout=2
            )
            return result.returncode == 0
        except Exception:
            logger.warning("Docker sandbox is unavailable.")
            return False

    def execute(self, language: str, code: str, stdin: str):
        if not self.is_available:
            raise RuntimeError("Secure code execution requires the configured sandbox runtime.")
        
        # In a fully deployed environment with Docker, we would map the code/stdin to temporary files,
        # run a limited container, stream output, enforce timeout and memory constraints, and parse the return code.
        # But per the mandate, we do not fall back to unsafe exec/subprocess on the host.
        raise RuntimeError("Secure code execution requires the configured sandbox runtime.")

sandbox = DockerSandbox()
