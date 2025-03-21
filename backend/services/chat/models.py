
from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    """
    MongoDB schema for chat messages
    Note: This is not an SQLAlchemy model since we're using MongoDB
    """
    text: str
    isUser: bool
    timestamp: datetime = Field(default_factory=datetime.now)
    
class ChatSession(BaseModel):
    """MongoDB schema for chat sessions"""
    session_id: str = Field(..., alias="_id")
    user_id: Optional[int] = None  # Linked to SQL User ID
    username: Optional[str] = None  # For anonymous sessions
    module: Optional[str] = None   # Which module this chat belongs to
    agent_id: Optional[int] = None  # Which AI agent is involved
    messages: List[ChatMessage] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    metadata: Dict = Field(default_factory=dict)
