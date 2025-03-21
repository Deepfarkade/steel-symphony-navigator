
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.database.mongodb import get_mongo_db
from core.security.auth import get_password_hash, verify_password
from services.auth.mongodb_models import MongoUser

class MongoDBUserService:
    """Service for handling user operations in MongoDB"""
    
    def __init__(self, db: AsyncIOMotorDatabase = Depends(get_mongo_db)):
        self.db = db
        self.collection = db.users
    
    async def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get a user by username"""
        return await self.collection.find_one({"username": username})
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get a user by email"""
        return await self.collection.find_one({"email": email})
    
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user"""
        # Hash the password
        user_data["hashed_password"] = get_password_hash(user_data.pop("password"))
        
        # Add timestamps
        user_data["created_at"] = datetime.utcnow()
        
        # Insert the user into the collection
        result = await self.collection.insert_one(user_data)
        
        # Get the inserted user
        user = await self.collection.find_one({"_id": result.inserted_id})
        return user
    
    async def update_user(self, username: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a user"""
        # Add updated timestamp
        update_data["updated_at"] = datetime.utcnow()
        
        # If password is being updated, hash it
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
        # Update the user
        await self.collection.update_one(
            {"username": username},
            {"$set": update_data}
        )
        
        # Get the updated user
        return await self.get_user_by_username(username)
    
    async def delete_user(self, username: str) -> bool:
        """Delete a user"""
        result = await self.collection.delete_one({"username": username})
        return result.deleted_count > 0
    
    async def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate a user with username and password"""
        user = await self.get_user_by_username(username)
        
        if not user:
            return None
            
        if not verify_password(password, user["hashed_password"]):
            return None
            
        return user
    
    async def list_users(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """List all users with pagination"""
        cursor = self.collection.find().skip(skip).limit(limit)
        return await cursor.to_list(length=limit)
    
    async def get_user_permissions(self, username: str) -> Dict[str, Any]:
        """Get user permissions (allowed modules and agents)"""
        user = await self.get_user_by_username(username)
        if not user:
            return {"allowed_modules": [], "allowed_agents": []}
            
        return {
            "role": user.get("role", "user"),
            "allowed_modules": user.get("allowed_modules", []),
            "allowed_agents": user.get("allowed_agents", [])
        }
    
    async def update_user_permissions(self, username: str, 
                                     allowed_modules: List[str] = None, 
                                     allowed_agents: List[int] = None) -> bool:
        """Update user permissions"""
        update_data = {}
        
        if allowed_modules is not None:
            update_data["allowed_modules"] = allowed_modules
            
        if allowed_agents is not None:
            update_data["allowed_agents"] = allowed_agents
            
        if not update_data:
            return False
            
        user = await self.update_user(username, update_data)
        return user is not None
    
    async def search_users(self, query: str) -> List[Dict[str, Any]]:
        """Search users by username, email, or full name"""
        cursor = self.collection.find({
            "$or": [
                {"username": {"$regex": query, "$options": "i"}},
                {"email": {"$regex": query, "$options": "i"}},
                {"full_name": {"$regex": query, "$options": "i"}}
            ]
        })
        return await cursor.to_list(length=100)
