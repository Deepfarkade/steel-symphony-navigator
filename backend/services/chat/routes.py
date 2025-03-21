
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any

from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

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

# Create a simple logger class
class SessionLogger:
    @staticmethod
    def log(user_id: str, log_type: str, message: str, level: str = "info"):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{level.upper()}] [User: {user_id}] [{log_type}] {message}")

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
    user_id = str(current_user.id) if current_user else "anonymous"
    SessionLogger.log(user_id, "route", "🆕 Creating new chat session")
    
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
    
    # Store in MongoDB
    await db[settings.MONGODB_CHAT_COLLECTION].insert_one(session.dict(by_alias=True))
    
    SessionLogger.log(user_id, "success", f"✨ Session created: {session_id[:8]}...", "success")
    
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

@router.get("/sessions", response_model=List[ChatSessionResponse])
async def get_user_chat_sessions(
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user),
    module: Optional[str] = Query(None, description="Filter sessions by module")
):
    """
    Get all chat sessions for the current user with optional module filtering
    """
    user_id = str(current_user.id)
    SessionLogger.log(user_id, "route", "📋 Fetching user sessions")
    
    # Build query with optional module filter
    query = {"user_id": current_user.id}
    if module:
        query["module"] = module
    
    cursor = db[settings.MONGODB_CHAT_COLLECTION].find(query).sort("updated_at", -1)
    sessions = []
    
    async for session in cursor:
        sessions.append(ChatSessionResponse(
            session_id=session["_id"],
            messages=[
                ChatMessageResponse(
                    text=msg["text"],
                    isUser=msg["isUser"],
                    timestamp=msg["timestamp"]
                ) for msg in session["messages"][-5:]  # Return only last 5 messages for preview
            ],
            module=session.get("module"),
            agent_id=session.get("agent_id"),
            created_at=session["created_at"],
            updated_at=session["updated_at"]
        ))
    
    SessionLogger.log(user_id, "success", f"📚 Retrieved {len(sessions)} sessions", "success")
    return sessions

@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(
    session_id: str = Path(..., description="The ID of the chat session to retrieve"),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get a chat session by ID
    """
    user_id = str(current_user.id)
    SessionLogger.log(user_id, "route", f"📥 Fetching session {session_id[:8]}...")
    
    session = await db[settings.MONGODB_CHAT_COLLECTION].find_one({
        "_id": session_id,
        "user_id": current_user.id
    })
    
    if not session:
        SessionLogger.log(user_id, "error", f"❌ Session {session_id[:8]}... not found", "error")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found or you don't have access"
        )
    
    SessionLogger.log(user_id, "success", f"📁 Session {session_id[:8]}... retrieved", "success")
    
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

@router.post("/{session_id}/send", response_model=ChatMessageResponse)
async def add_message_to_session(
    message: ChatMessageRequest,
    session_id: str = Path(..., description="The ID of the chat session"),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Add a message to a chat session and get AI response
    """
    user_id = str(current_user.id)
    SessionLogger.log(user_id, "route", f"💬 New message in session {session_id[:8]}...")
    SessionLogger.log(user_id, "message", f"📝 Message: {message.text[:50]}...")
    
    # Find the session and verify ownership
    session = await db[settings.MONGODB_CHAT_COLLECTION].find_one({
        "_id": session_id,
        "user_id": current_user.id
    })
    
    if not session:
        SessionLogger.log(user_id, "error", f"❌ Session {session_id[:8]}... not found or not owned", "error")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found or you don't have access"
        )
    
    # Add user message to session
    user_message = ChatMessage(
        text=message.text,
        isUser=True
    )
    
    await db[settings.MONGODB_CHAT_COLLECTION].update_one(
        {"_id": session_id},
        {
            "$push": {"messages": user_message.dict()},
            "$set": {"updated_at": datetime.now()}
        }
    )
    
    # Get AI response based on module context
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
    
    await db[settings.MONGODB_CHAT_COLLECTION].update_one(
        {"_id": session_id},
        {
            "$push": {"messages": ai_message.dict()},
            "$set": {"updated_at": datetime.now()}
        }
    )
    
    SessionLogger.log(user_id, "success", "✅ Message processed successfully", "success")
    
    return ChatMessageResponse(
        text=ai_message.text,
        isUser=ai_message.isUser,
        timestamp=ai_message.timestamp
    )

@router.get("/{session_id}/messages", response_model=List[ChatMessageResponse])
async def get_session_messages(
    session_id: str = Path(..., description="The ID of the chat session"),
    limit: int = Query(50, description="Maximum number of messages to return"),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get messages for a specific chat session
    """
    user_id = str(current_user.id)
    SessionLogger.log(user_id, "route", f"📥 Fetching messages for session {session_id[:8]}...")
    
    # Find the session and verify ownership
    session = await db[settings.MONGODB_CHAT_COLLECTION].find_one({
        "_id": session_id,
        "user_id": current_user.id
    })
    
    if not session:
        SessionLogger.log(user_id, "error", f"❌ Session {session_id[:8]}... not found or not owned", "error")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found or you don't have access"
        )
    
    # Get messages (with limit)
    messages = session["messages"][-limit:] if limit > 0 else session["messages"]
    
    SessionLogger.log(user_id, "success", f"📨 Retrieved {len(messages)} messages", "success")
    
    return [
        ChatMessageResponse(
            text=msg["text"],
            isUser=msg["isUser"],
            timestamp=msg["timestamp"]
        ) for msg in messages
    ]

@router.delete("/sessions/{session_id}", status_code=204)
async def delete_session(
    session_id: str = Path(..., description="The ID of the chat session to delete"),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a chat session
    """
    user_id = str(current_user.id)
    SessionLogger.log(user_id, "route", f"🗑️ Deleting session {session_id[:8]}...")
    
    # Delete the session and verify ownership
    result = await db[settings.MONGODB_CHAT_COLLECTION].delete_one({
        "_id": session_id,
        "user_id": current_user.id
    })
    
    if result.deleted_count == 0:
        SessionLogger.log(user_id, "error", f"❌ Session {session_id[:8]}... not found or not owned", "error")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found or you don't have access"
        )
    
    SessionLogger.log(user_id, "success", "🧹 Session deleted successfully", "success")

@router.get("/module/{module_name}", response_model=ChatSessionResponse)
async def get_or_create_module_chat(
    module_name: str = Path(..., description="The module name to create a chat for"),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get or create a module-specific chat session
    """
    user_id = str(current_user.id)
    SessionLogger.log(user_id, "route", f"🔍 Finding/creating chat for module: {module_name}")
    
    # First, try to find an existing session for this module
    session = await db[settings.MONGODB_CHAT_COLLECTION].find_one({
        "user_id": current_user.id,
        "module": module_name
    }, sort=[("updated_at", -1)])  # Get the most recent one
    
    # If no session exists, create a new one
    if not session:
        SessionLogger.log(user_id, "info", f"🆕 No existing session for module {module_name}, creating new")
        
        # Create request object for the helper function
        create_request = CreateSessionRequest(module=module_name)
        
        # Call the existing function to create a new session
        return await create_chat_session(
            request=create_request,
            db=db,
            current_user=current_user
        )
    
    # Return existing session
    SessionLogger.log(user_id, "success", f"🔄 Using existing session {session['_id'][:8]}...", "success")
    
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

@router.get("/agents/{agent_id}", response_model=ChatSessionResponse)
async def get_or_create_agent_chat(
    agent_id: int = Path(..., description="The agent ID to create a chat for"),
    db: AsyncIOMotorDatabase = Depends(get_mongo_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get or create an agent-specific chat session
    """
    user_id = str(current_user.id)
    SessionLogger.log(user_id, "route", f"🔍 Finding/creating chat for agent: {agent_id}")
    
    # First, try to find an existing session for this agent
    session = await db[settings.MONGODB_CHAT_COLLECTION].find_one({
        "user_id": current_user.id,
        "agent_id": agent_id
    }, sort=[("updated_at", -1)])  # Get the most recent one
    
    # If no session exists, create a new one
    if not session:
        SessionLogger.log(user_id, "info", f"🆕 No existing session for agent {agent_id}, creating new")
        
        # Create request object for the helper function
        create_request = CreateSessionRequest(agent_id=agent_id)
        
        # Call the existing function to create a new session
        return await create_chat_session(
            request=create_request,
            db=db,
            current_user=current_user
        )
    
    # Return existing session
    SessionLogger.log(user_id, "success", f"🔄 Using existing session {session['_id'][:8]}...", "success")
    
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

# Import settings at the end to avoid circular imports
from config.settings import get_settings
settings = get_settings()
