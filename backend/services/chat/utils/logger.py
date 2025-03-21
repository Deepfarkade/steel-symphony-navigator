
import time

class SessionLogger:
    @staticmethod
    def log(session_id: str, log_type: str, message: str, level: str = "info"):
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{level.upper()}] [Session: {session_id[:8]}...] [{log_type}] {message}")

    @staticmethod
    def progress(current: int, total: int, message: str, session_id: str):
        percent = int((current / total) * 100)
        print(f"[PROGRESS] [Session: {session_id[:8]}...] {percent}% - {message}")
