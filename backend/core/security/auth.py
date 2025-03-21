
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Union

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from motor.motor_asyncio import AsyncIOMotorDatabase

from config.settings import get_settings
from core.database.mssql import get_db
from core.database.mongodb import get_mongo_db
from services.auth.models import User

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a password hash"""
    return pwd_context.hash(password)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Data to encode in the token
        expires_delta: Optional token expiration time
        
    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db),
    mongo_db: AsyncIOMotorDatabase = Depends(get_mongo_db)
) -> User:
    """
    Get the current authenticated user from JWT token
    
    Args:
        token: JWT token
        db: Database session
        mongo_db: MongoDB database
        
    Returns:
        User: Current authenticated user
        
    Raises:
        HTTPException: If authentication fails
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Try to fetch user from SQL database
    user = db.query(User).filter(User.username == username).first()
    
    # If not found in SQL, try MongoDB
    if user is None:
        mongo_user = await mongo_db.users.find_one({"username": username})
        if mongo_user is None:
            raise credentials_exception
            
        # Create a temporary User object from MongoDB data
        user = User(
            id=-1,  # Use a placeholder ID
            username=mongo_user["username"],
            email=mongo_user["email"],
            full_name=mongo_user.get("full_name"),
            hashed_password=mongo_user["hashed_password"],
            is_active=mongo_user["is_active"],
            role=mongo_user["role"],
            allowed_modules=mongo_user["allowed_modules"],
            allowed_agents=mongo_user["allowed_agents"]
        )
        
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Check if the user is active"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Check if the user is an admin"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Admin role required."
        )
    return current_user

def has_module_access(module_name: str, current_user: User = Depends(get_current_active_user)) -> bool:
    """Check if user has access to a specific module"""
    if current_user.role == "admin":
        return True
    return module_name in current_user.allowed_modules

def has_agent_access(agent_id: int, current_user: User = Depends(get_current_active_user)) -> bool:
    """Check if user has access to a specific agent"""
    if current_user.role == "admin":
        return True
    return agent_id in current_user.allowed_agents
