
from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class ChatMessageRequest(BaseModel):
    """Schema for chat message requests"""
    text: str
    
class ChatMessageResponse(BaseModel):
    """Schema for chat message responses"""
    text: str
    isUser: bool
    timestamp: datetime

class ChatSessionResponse(BaseModel):
    """Schema for chat session responses"""
    session_id: str
    messages: List[ChatMessageResponse]
    module: Optional[str] = None
    agent_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

class CreateSessionRequest(BaseModel):
    """Schema for creating a new chat session"""
    module: Optional[str] = None
    agent_id: Optional[int] = None
    metadata: Dict = Field(default_factory=dict)
