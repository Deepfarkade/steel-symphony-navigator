
from typing import Optional, Dict, Any
import logging
from datetime import datetime
from backend.database.mongodb import MongoDB
from backend.utils.logger import SessionLogger

class CacheService:
    def __init__(self):
        self.cache_collection = "chat_cache"

    async def get_cached_response(self, message: str) -> Optional[Dict[str, Any]]:
        """Get cached response for a message"""
        try:
            SessionLogger.log('CACHE', 'cache', 'Checking cache storage')
            cache_collection = await MongoDB.get_collection(self.cache_collection)
            # Use text as key to find cached response
            cached_item = await cache_collection.find_one({"message": message})
            
            if cached_item:
                SessionLogger.log('CACHE', 'cache_hit', f'Found cached response for: {message[:30]}...')
                return cached_item.get("response")
            SessionLogger.log('CACHE', 'cache_miss', f'No cache found for: {message[:30]}...')
            return None
            
        except Exception as e:
            SessionLogger.log('CACHE', 'error', f'Cache retrieval error: {str(e)}', 'error')
            return None

    async def set_cached_response(self, message: str, response: Dict[str, Any]) -> None:
        """Cache a response for a message"""
        try:
            cache_collection = await MongoDB.get_collection(self.cache_collection)
            
            # Create cache document with timestamp
            cache_document = {
                "message": message,
                "response": response,
                "created_at": datetime.utcnow()
            }
            
            # Upsert the cache entry
            result = await cache_collection.update_one(
                {"message": message},
                {"$set": cache_document},
                upsert=True
            )
            
            logging.info(f"Cache {'updated' if result.modified_count else 'inserted'} for message: {message[:50]}...")
            
        except Exception as e:
            logging.error(f"Cache storage error: {e}")
            # Don't raise the exception - let the application continue even if caching fails

    async def get_from_collection(self, collection_name: str, query: Dict) -> Optional[Dict]:
        """Get cached response from specified collection"""
        try:
            collection = await MongoDB.get_collection(collection_name)
            result = await collection.find_one(query)
            return result
        except Exception as e:
            print(f"Cache get error: {e}")
            return None

    async def cache_to_collection(self, collection_name: str, query: Dict, data: Dict) -> None:
        """Cache response to specified collection"""
        try:
            collection = await MongoDB.get_collection(collection_name)
            await collection.update_one(
                query,
                {"$set": data},
                upsert=True
            )
        except Exception as e:
            print(f"Cache set error: {e}")
