
import asyncio
import os
import time

class SessionManager:
    _instance = None
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def __init__(self):
        self._sessions = {}
        self.session_semaphores = {}
    
    async def get_session_interpreter(self, session_id: str):
        """Get or create a session-specific interpreter"""
        if session_id not in self._sessions:
            # Create temp directory for session
            temp_dir = f"/tmp/session_{session_id}"
            os.makedirs(temp_dir, exist_ok=True)
            
            # Initialize session data
            self._sessions[session_id] = {
                'interpreter': None,  # Real implementation would initialize interpreter here
                'temp_dir': temp_dir,
                'created_at': time.time()
            }
        
        return self._sessions[session_id]
    
    async def acquire_semaphore(self, session_id: str):
        """Get a semaphore for a session to control concurrent access"""
        if session_id not in self.session_semaphores:
            self.session_semaphores[session_id] = asyncio.Semaphore(1)
        
        await self.session_semaphores[session_id].acquire()
        return self.session_semaphores[session_id]
    
    async def release_semaphore(self, session_id: str):
        """Release the semaphore for a session"""
        if session_id in self.session_semaphores:
            self.session_semaphores[session_id].release()
