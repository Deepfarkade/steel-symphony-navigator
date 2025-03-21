
import motor.motor_asyncio
from config.settings import get_settings
from typing import Optional, Dict, Any

settings = get_settings()

class MongoDB:
    """MongoDB connection utility class with async support"""
    
    _client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
    _db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None
    
    @classmethod
    async def get_database(cls):
        """Get or create database connection"""
        if cls._db is None:
            # Initialize database connection
            cls._client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
            cls._db = cls._client[settings.MONGODB_DATABASE]
            
            # Verify connection
            try:
                await cls._client.admin.command('ping')
                print(f"✅ MongoDB class connected to: {settings.MONGODB_DATABASE}")
            except Exception as e:
                print(f"❌ MongoDB connection error: {str(e)}")
                raise
                
        return cls._db
    
    @classmethod
    async def get_collection(cls, collection_name: str):
        """Get a collection from the database"""
        db = await cls.get_database()
        return db[collection_name]
    
    @classmethod
    async def close_connection(cls):
        """Close MongoDB connection if open"""
        if cls._client is not None:
            cls._client.close()
            cls._client = None
            cls._db = None
            print("MongoDB connection closed")
