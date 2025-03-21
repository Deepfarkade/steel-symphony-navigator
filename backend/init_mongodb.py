
import asyncio
import motor.motor_asyncio
from datetime import datetime
from core.security.auth import get_password_hash
from config.settings import get_settings

settings = get_settings()

async def init_mongodb():
    """Initialize MongoDB with predefined users and collections."""
    print(f"Connecting to MongoDB at: {settings.MONGODB_URI}")
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DATABASE]
    
    # Create indexes for various collections
    print("Creating indexes for MongoDB collections...")
    
    # User collection
    user_collection = db.users
    await user_collection.create_index("username", unique=True)
    await user_collection.create_index("email", unique=True)
    
    # Chat sessions collection
    chat_collection = db[settings.MONGODB_CHAT_COLLECTION]
    await chat_collection.create_index([("user_id", 1), ("updated_at", -1)])
    await chat_collection.create_index([("user_id", 1), ("module", 1), ("updated_at", -1)])
    await chat_collection.create_index([("user_id", 1), ("agent_id", 1), ("updated_at", -1)])
    
    # Check if users already exist
    count = await user_collection.count_documents({})
    if count > 0:
        print(f"MongoDB already has {count} users. Skipping user initialization.")
        return
    
    # Define the predefined users
    predefined_users = [
        {
            "username": "admin",
            "email": "admin@example.com",
            "full_name": "Admin User",
            "hashed_password": get_password_hash("admin123"),
            "is_active": True,
            "role": "admin",
            "allowed_modules": ["demand-planning", "supply-planning", "order-promising", "factory-planning", "inventory-optimization", "risk-management"],
            "allowed_agents": [101, 102, 103, 104, 105, 106, 107, 108, 109, 110],
            "created_at": datetime.utcnow()
        },
        {
            "username": "user",
            "email": "user@example.com",
            "full_name": "Regular User",
            "hashed_password": get_password_hash("user123"),
            "is_active": True,
            "role": "user",
            "allowed_modules": ["demand-planning", "supply-planning"],
            "allowed_agents": [101, 102],
            "created_at": datetime.utcnow()
        },
        {
            "username": "manager",
            "email": "manager@example.com",
            "full_name": "Manager User",
            "hashed_password": get_password_hash("manager123"),
            "is_active": True,
            "role": "user",
            "allowed_modules": ["demand-planning", "supply-planning", "inventory-optimization"],
            "allowed_agents": [101, 102, 103, 104, 105],
            "created_at": datetime.utcnow()
        },
        {
            "username": "analyst",
            "email": "analyst@example.com",
            "full_name": "Data Analyst",
            "hashed_password": get_password_hash("analyst123"),
            "is_active": True,
            "role": "user",
            "allowed_modules": ["demand-planning", "factory-planning"],
            "allowed_agents": [102, 103, 106],
            "created_at": datetime.utcnow()
        },
        {
            "username": "planner",
            "email": "planner@example.com",
            "full_name": "Supply Planner",
            "hashed_password": get_password_hash("planner123"),
            "is_active": True,
            "role": "user",
            "allowed_modules": ["supply-planning", "order-promising"],
            "allowed_agents": [101, 104, 105, 107],
            "created_at": datetime.utcnow()
        }
    ]
    
    # Insert the predefined users
    result = await user_collection.insert_many(predefined_users)
    print(f"Inserted {len(result.inserted_ids)} predefined users into MongoDB.")

if __name__ == "__main__":
    asyncio.run(init_mongodb())
