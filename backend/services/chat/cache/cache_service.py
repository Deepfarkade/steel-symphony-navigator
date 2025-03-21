
import time
from typing import Dict, Optional

class CacheService:
    def __init__(self):
        self.cache = {}
        self.ttl = 3600  # 1 hour cache TTL

    async def get_cached_response(self, key: str) -> Optional[Dict]:
        """Get response from cache if it exists and is not expired"""
        if key in self.cache:
            timestamp, response = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return response
            else:
                # Remove expired cache entry
                del self.cache[key]
        return None

    async def set_cached_response(self, key: str, response: Dict):
        """Cache a response with current timestamp"""
        self.cache[key] = (time.time(), response)
