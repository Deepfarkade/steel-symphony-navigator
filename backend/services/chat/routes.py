
import uuid
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from core.database.mongodb import get_mongo_db
from core.security.auth import get_current_active_user
from services.auth.models import User
from services.chat.models import ChatMessage, ChatSession
from services.chat.schemas import (
    ChatMessageRequest, 
    ChatMessageResponse,
    ChatSessionResponse,
    CreateSessionRequest
)
from services.chat.ai_service import get_ai_response

router = APIRouter()

@router.post("/sessions", response_model=ChatSessionResponse)
async def create_chat_session(
    request: CreateSessionRequest,
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: Optional[User] = Depends(get_current_active_user)
):
    """
    Create a new chat session
    """
    session_id = str(uuid.uuid4())
    
    # Initial welcome message from AI
    welcome_message = ChatMessage(
        text=f"Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel {request.module or 'operations'} today?",
        isUser=False
    )
    
    # Create session
    session = ChatSession(
        _id=session_id,
        user_id=current_user.id if current_user else None,
        username=current_user.username if current_user else None,
        module=request.module,
        agent_id=request.agent_id,
        messages=[welcome_message],
        metadata=request.metadata
    )
    
    await db.chat_sessions.insert_one(session.dict(by_alias=True))
    
    return ChatSessionResponse(
        session_id=session_id,
        messages=[
            ChatMessageResponse(
                text=welcome_message.text,
                isUser=welcome_message.isUser,
                timestamp=welcome_message.timestamp
            )
        ],
        module=request.module,
        agent_id=request.agent_id,
        created_at=session.created_at,
        updated_at=session.updated_at
    )

@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(
    session_id: str,
    db: AsyncIOMotorDatabase = Depends(get_mongo_db)
):
    """
    Get a chat session by ID
    """
    session = await db.chat_sessions.find_one({"_id": session_id})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    return ChatSessionResponse(
        session_id=session["_id"],
        messages=[
            ChatMessageResponse(
                text=msg["text"],
                isUser=msg["isUser"],
                timestamp=msg["timestamp"]
            ) for msg in session["messages"]
        ],
        module=session.get("module"),
        agent_id=session.get("agent_id"),
        created_at=session["created_at"],
        updated_at=session["updated_at"]
    )

@router.post("/sessions/{session_id}/messages", response_model=ChatMessageResponse)
async def add_message_to_session(
    session_id: str,
    message: ChatMessageRequest,
    db: AsyncIOMotorDatabase = Depends(get_mongo_db)
):
    """
    Add a message to a chat session and get AI response
    """
    # Find the session
    session = await db.chat_sessions.find_one({"_id": session_id})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # Add user message to session
    user_message = ChatMessage(
        text=message.text,
        isUser=True
    )
    
    await db.chat_sessions.update_one(
        {"_id": session_id},
        {
            "$push": {"messages": user_message.dict()},
            "$set": {"updated_at": datetime.now()}
        }
    )
    
    # Get AI response
    ai_response_text = await get_ai_response(
        message.text, 
        session["messages"], 
        session.get("module"), 
        session.get("agent_id")
    )
    
    # Add AI response to session
    ai_message = ChatMessage(
        text=ai_response_text,
        isUser=False
    )
    
    await db.chat_sessions.update_one(
        {"_id": session_id},
        {
            "$push": {"messages": ai_message.dict()},
            "$set": {"updated_at": datetime.now()}
        }
    )
    
    return ChatMessageResponse(
        text=ai_message.text,
        isUser=ai_message.isUser,
        timestamp=ai_message.timestamp
    )

@router.get("/sessions", response_model=List[ChatSessionResponse])
async def get_user_chat_sessions(
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all chat sessions for the current user
    """
    cursor = db.chat_sessions.find({"user_id": current_user.id})
    sessions = []
    
    async for session in cursor:
        sessions.append(ChatSessionResponse(
            session_id=session["_id"],
            messages=[
                ChatMessageResponse(
                    text=msg["text"],
                    isUser=msg["isUser"],
                    timestamp=msg["timestamp"]
                ) for msg in session["messages"]
            ],
            module=session.get("module"),
            agent_id=session.get("agent_id"),
            created_at=session["created_at"],
            updated_at=session["updated_at"]
        ))
    
    return sessions

@router.get("/{module}", response_model=ChatSessionResponse)
async def get_module_chat(module: str):
    """
    Get or create a module-specific chat session
    
    This is a convenience endpoint that creates a module-specific chat
    if one doesn't exist already for the current user.
    """
    # Implementation would create a new session for the module
    # or retrieve the latest one for the user
    # (For brevity, detailed implementation not shown)
    pass

@router.get("/agents/{agent_id}", response_model=ChatSessionResponse)
async def get_agent_chat(agent_id: int):
    """
    Get or create an agent-specific chat session
    
    This is a convenience endpoint that creates an agent-specific chat
    if one doesn't exist already for the current user.
    """
    # Implementation would create a new session for the agent
    # or retrieve the latest one for the user
    # (For brevity, detailed implementation not shown)
    pass
