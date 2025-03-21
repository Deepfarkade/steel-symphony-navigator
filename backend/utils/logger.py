
import logging
import time
from typing import Optional

class SessionLogger:
    """Utility class for logging session information"""
    
    @staticmethod
    def log(session_id: str, log_type: str, message: str, level: str = "info"):
        """Log a message with session ID"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        
        # Use Python's logging module with appropriate level
        logger = logging.getLogger(f"session.{session_id}")
        
        log_message = f"[{timestamp}] [Session: {session_id}] [{log_type}] {message}"
        
        if level.lower() == "error":
            logger.error(log_message)
        elif level.lower() == "warning":
            logger.warning(log_message)
        elif level.lower() == "debug":
            logger.debug(log_message)
        else:
            logger.info(log_message)
            
        # Also print to console for development
        print(log_message)
    
    @staticmethod
    def progress(current: int, total: int, message: str, session_id: str):
        """Log progress of a task"""
        percent = int((current / total) * 100)
        SessionLogger.log(
            session_id, 
            "progress", 
            f"{percent}% - {message}"
        )
