
import motor.motor_asyncio
from config.settings import get_settings

settings = get_settings()
mongo_client = None
mongo_db = None

async def connect_to_mongo():
    """
    Connect to MongoDB and initialize global client and database variables
    """
    global mongo_client, mongo_db
    try:
        # Connect to MongoDB using URI from settings
        mongo_client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        mongo_db = mongo_client[settings.MONGODB_DATABASE]
        
        # Test connection by getting server info
        await mongo_client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {settings.MONGODB_DATABASE}")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {str(e)}")
        raise

async def close_mongo_connection():
    """
    Close MongoDB connection
    """
    global mongo_client
    if mongo_client:
        mongo_client.close()
        print("Closed MongoDB connection")

def get_mongo_db():
    """
    Get MongoDB database instance
    
    Returns:
        Database: MongoDB database instance
    """
    if mongo_db is None:
        raise Exception("MongoDB connection not initialized")
    return mongo_db
