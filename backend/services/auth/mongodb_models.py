
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class MongoUser(BaseModel):
    """User model for MongoDB"""
    username: str
    email: str
    full_name: Optional[str] = None
    hashed_password: str
    is_active: bool = True
    role: str = "user"  # 'user' or 'admin'
    allowed_modules: List[str] = Field(default_factory=list)  # List of allowed modules
    allowed_agents: List[int] = Field(default_factory=list)  # List of allowed agent IDs
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    class Config:
        schema_extra = {
            "example": {
                "username": "johnsmith",
                "email": "john.smith@example.com",
                "full_name": "John Smith",
                "hashed_password": "hashed_password_here",
                "is_active": True,
                "role": "user",
                "allowed_modules": ["demand-planning", "supply-planning"],
                "allowed_agents": [1, 2, 3]
            }
        }
