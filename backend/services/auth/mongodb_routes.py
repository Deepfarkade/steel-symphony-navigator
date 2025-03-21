
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Dict, Any, Annotated
from datetime import timedelta

from config.settings import get_settings
from core.security.auth import (
    get_current_active_user,
    create_access_token
)
from services.auth.mongodb_service import MongoDBUserService
from services.auth.mongodb_models import MongoUser
from services.auth.schemas import UserCreate, UserResponse, Token, LoginForm

settings = get_settings()
router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_data: UserCreate, user_service: MongoDBUserService = Depends()):
    """
    Create a new user - only accessible to admins
    """
    # Check if user already exists
    db_user = await user_service.get_user_by_username(user_data.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    db_email = await user_service.get_user_by_email(user_data.email)
    if db_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_dict = user_data.dict()
    created_user = await user_service.create_user(user_dict)
    
    # Convert to response model
    return UserResponse(
        id=str(created_user["_id"]),
        username=created_user["username"],
        email=created_user["email"],
        full_name=created_user.get("full_name"),
        role=created_user.get("role", "user"),
        allowed_modules=created_user.get("allowed_modules", []),
        allowed_agents=created_user.get("allowed_agents", []),
        is_active=created_user.get("is_active", True)
    )

@router.post("/login", response_model=Token)
async def login(form_data: LoginForm, user_service: MongoDBUserService = Depends()):
    """
    Authenticate a user and return a JWT token
    """
    user = await user_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user.get("role", "user")}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_role": user.get("role", "user")}

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    user_service: MongoDBUserService = Depends()
):
    """
    OAuth2 compatible token endpoint
    """
    user = await user_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user.get("role", "user")}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user_role": user.get("role", "user")}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: Dict[str, Any] = Depends(get_current_active_user),
):
    """
    Get current authenticated user information
    """
    return UserResponse(
        id=str(current_user.get("_id", "0")),
        username=current_user["username"],
        email=current_user["email"],
        full_name=current_user.get("full_name"),
        role=current_user.get("role", "user"),
        allowed_modules=current_user.get("allowed_modules", []),
        allowed_agents=current_user.get("allowed_agents", []),
        is_active=current_user.get("is_active", True)
    )

@router.get("/me/permissions")
async def get_current_user_permissions(
    current_user: Dict[str, Any] = Depends(get_current_active_user),
):
    """
    Get current user's permissions (modules and agents)
    """
    return {
        "role": current_user.get("role", "user"),
        "allowed_modules": current_user.get("allowed_modules", []),
        "allowed_agents": current_user.get("allowed_agents", [])
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
async def validate_token(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    """
    Validate a token and return basic user info if valid
    """
    return {
        "valid": True, 
        "user_id": str(current_user.get("_id", "0")), 
        "username": current_user["username"],
        "role": current_user.get("role", "user"),
        "allowed_modules": current_user.get("allowed_modules", []),
        "allowed_agents": current_user.get("allowed_agents", [])
    }

@router.get("/users", response_model=List[UserResponse])
async def list_users(
    skip: int = 0, 
    limit: int = 100,
    user_service: MongoDBUserService = Depends()
):
    """
    List all users - admin only endpoint
    """
    users = await user_service.list_users(skip, limit)
    return [
        UserResponse(
            id=str(user.get("_id", "0")),
            username=user["username"],
            email=user["email"],
            full_name=user.get("full_name"),
            role=user.get("role", "user"),
            allowed_modules=user.get("allowed_modules", []),
            allowed_agents=user.get("allowed_agents", []),
            is_active=user.get("is_active", True)
        ) for user in users
    ]

@router.put("/users/{username}/permissions")
async def update_user_permissions(
    username: str,
    allowed_modules: List[str] = None,
    allowed_agents: List[int] = None,
    user_service: MongoDBUserService = Depends()
):
    """
    Update user permissions - admin only endpoint
    """
    success = await user_service.update_user_permissions(
        username=username,
        allowed_modules=allowed_modules,
        allowed_agents=allowed_agents
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{username}' not found"
        )
        
    return {"detail": f"Permissions updated for user '{username}'"}
