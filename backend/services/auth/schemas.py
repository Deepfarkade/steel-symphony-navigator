
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    """Base user data shared across requests"""
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    """User data required for creating a new user"""
    password: str = Field(..., min_length=8)
    role: str = "user"
    allowed_modules: List[str] = []
    allowed_agents: List[int] = []

class UserResponse(UserBase):
    """User data returned in responses"""
    id: int
    is_active: bool
    role: str
    allowed_modules: List[str]
    allowed_agents: List[int]
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    """Schema for authentication token"""
    access_token: str
    token_type: str
    user_role: str  # Added user role to token response

class TokenData(BaseModel):
    """Schema for token payload data"""
    username: Optional[str] = None
    role: Optional[str] = None

class LoginForm(BaseModel):
    """Schema for login request"""
    username: str
    password: str
