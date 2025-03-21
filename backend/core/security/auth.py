
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
) -> Union[User, Dict[str, Any]]:
    """
    Get the current authenticated user from JWT token
    
    Args:
        token: JWT token
        db: SQL Database session
        mongo_db: MongoDB database
        
    Returns:
        Union[User, Dict[str, Any]]: Current authenticated user (SQL User object or MongoDB dict)
        
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
        
    # Try to fetch user from MongoDB first (primary datastore)
    mongo_user = await mongo_db.users.find_one({"username": username})
    if mongo_user:
        # Return MongoDB user dict
        return mongo_user
            
    # If not found in MongoDB, try SQL database
    sql_user = db.query(User).filter(User.username == username).first()
    if sql_user is None:
        raise credentials_exception
        
    return sql_user

async def get_current_active_user(current_user: Union[User, Dict[str, Any]] = Depends(get_current_user)) -> Union[User, Dict[str, Any]]:
    """Check if the user is active"""
    is_active = current_user.is_active if isinstance(current_user, User) else current_user.get("is_active", True)
    
    if not is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_admin_user(current_user: Union[User, Dict[str, Any]] = Depends(get_current_active_user)) -> Union[User, Dict[str, Any]]:
    """Check if the user is an admin"""
    role = current_user.role if isinstance(current_user, User) else current_user.get("role", "user")
    
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Admin role required."
        )
    return current_user

def has_module_access(module_name: str, current_user: Union[User, Dict[str, Any]] = Depends(get_current_active_user)) -> bool:
    """Check if user has access to a specific module"""
    # Get role and allowed modules based on user type
    if isinstance(current_user, User):
        role = current_user.role
        allowed_modules = current_user.allowed_modules
    else:
        role = current_user.get("role", "user")
        allowed_modules = current_user.get("allowed_modules", [])
    
    if role == "admin":
        return True
    return module_name in allowed_modules

def has_agent_access(agent_id: int, current_user: Union[User, Dict[str, Any]] = Depends(get_current_active_user)) -> bool:
    """Check if user has access to a specific agent"""
    # Get role and allowed agents based on user type
    if isinstance(current_user, User):
        role = current_user.role
        allowed_agents = current_user.allowed_agents
    else:
        role = current_user.get("role", "user")
        allowed_agents = current_user.get("allowed_agents", [])
    
    if role == "admin":
        return True
    return agent_id in allowed_agents
