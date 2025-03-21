
import asyncio
import logging
import time
import uuid
from typing import Dict, Any

class RequestQueue:
    def __init__(self):
        self.pending_requests = {}
        self.results = {}
        self.lock = asyncio.Lock()

    async def enqueue_request(self, session_id: str, user_id: str, message: str) -> str:
        """Add a request to the queue and return its key"""
        request_key = str(uuid.uuid4())
        async with self.lock:
            self.pending_requests[request_key] = {
                'session_id': session_id,
                'user_id': user_id,
                'message': message,
                'status': 'pending',
                'timestamp': time.time()
            }
        return request_key

    async def process_request(self, request_key: str, processor_func, *args, **kwargs):
        """Process a request and store its result"""
        try:
            result = await processor_func(*args, **kwargs)
            async with self.lock:
                self.results[request_key] = {
                    'status': 'completed',
                    'result': result,
                    'timestamp': time.time()
                }
                if request_key in self.pending_requests:
                    del self.pending_requests[request_key]
        except Exception as e:
            logging.error(f"Error processing request {request_key}: {str(e)}")
            async with self.lock:
                self.results[request_key] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': time.time()
                }
                if request_key in self.pending_requests:
                    del self.pending_requests[request_key]

    async def get_result(self, request_key: str, timeout: float = 60.0) -> Dict:
        """Wait for and return the result of a request"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            async with self.lock:
                if request_key in self.results:
                    result = self.results[request_key]
                    # Clean up after retrieving
                    del self.results[request_key]
                    if result['status'] == 'completed':
                        return result['result']
                    elif result['status'] == 'error':
                        raise Exception(f"Request processing failed: {result.get('error', 'Unknown error')}")
            await asyncio.sleep(0.1)
        raise TimeoutError(f"Request {request_key} timed out after {timeout} seconds")
