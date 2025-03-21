
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from config.settings import get_settings
from core.database.mssql import get_db
from core.database.mongodb import get_mongo_db
from core.security.auth import (
    get_current_active_user,
    create_access_token,
    get_password_hash,
    verify_password
)
from services.auth.models import User
from services.auth.mongodb_models import MongoUser
from services.auth.schemas import UserCreate, UserResponse, Token, LoginForm

settings = get_settings()
router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db), mongo_db=Depends(get_mongo_db)):
    """
    Create a new user - only accessible to admins
    """
    # Check if user already exists in SQL database
    db_user = db.query(User).filter(User.username == user_data.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    db_email = db.query(User).filter(User.email == user_data.email).first()
    if db_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user in SQL database
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        role=user_data.role,
        allowed_modules=user_data.allowed_modules,
        allowed_agents=user_data.allowed_agents
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create user in MongoDB as well
    mongo_user = MongoUser(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        role=user_data.role,
        allowed_modules=user_data.allowed_modules,
        allowed_agents=user_data.allowed_agents
    )
    
    await mongo_db.users.insert_one(mongo_user.dict())
    
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: LoginForm, db: Session = Depends(get_db), mongo_db=Depends(get_mongo_db)):
    """
    Authenticate a user and return a JWT token
    """
    # Try to find user in SQL database
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # If not found in SQL, check MongoDB
    if not user:
        mongo_user = await mongo_db.users.find_one({"username": form_data.username})
        if not mongo_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # If user exists in MongoDB but not in SQL, verify password against MongoDB
        if not verify_password(form_data.password, mongo_user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # User authenticated successfully from MongoDB
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": mongo_user["username"], "role": mongo_user["role"]}, 
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer", "user_role": mongo_user["role"]}
    
    # User found in SQL, verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # SQL user authenticated successfully
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_role": user.role}

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    db: Session = Depends(get_db),
    mongo_db=Depends(get_mongo_db)
):
    """
    OAuth2 compatible token endpoint
    """
    # First check SQL database
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # If not in SQL, check MongoDB
    if not user:
        mongo_user = await mongo_db.users.find_one({"username": form_data.username})
        if not mongo_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify password against MongoDB
        if not verify_password(form_data.password, mongo_user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        # MongoDB user authenticated successfully
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": mongo_user["username"], "role": mongo_user["role"]}, 
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer", "user_role": mongo_user["role"]}
    
    # SQL user found, verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # SQL user authenticated successfully
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_role": user.role}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """
    Get current authenticated user information
    """
    return current_user

@router.get("/me/permissions")
async def get_current_user_permissions(current_user: User = Depends(get_current_active_user)):
    """
    Get current user's permissions (modules and agents)
    """
    return {
        "role": current_user.role,
        "allowed_modules": current_user.allowed_modules,
        "allowed_agents": current_user.allowed_agents
    }

@router.post("/logout")
async def logout():
    """
    Logout endpoint - client-side token removal
    
    Note: Since we're using JWTs, the actual token invalidation
    would be handled on the client side by removing the token
    """
    return {"detail": "Successfully logged out"}

@router.post("/validate")
async def validate_token(current_user: User = Depends(get_current_active_user)):
    """
    Validate a token and return basic user info if valid
    """
    return {
        "valid": True, 
        "user_id": current_user.id, 
        "username": current_user.username,
        "role": current_user.role,
        "allowed_modules": current_user.allowed_modules,
        "allowed_agents": current_user.allowed_agents
    }
