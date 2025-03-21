
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class AgentBase(BaseModel):
    """Base agent data shared across requests"""
    name: str
    description: str
    icon: str
    type: str

class AgentCreate(AgentBase):
    """Data required for creating a new agent"""
    confidence: Optional[float] = 75.0
    compatibility: Optional[str] = "medium"
    status: Optional[str] = "learning"

class AgentResponse(AgentBase):
    """Agent data returned in responses"""
    id: int
    confidence: float
    compatibility: str
    status: str
    last_updated: str

    class Config:
        from_attributes = True

class AgentAnalytics(BaseModel):
    """Analytics data for an agent"""
    issuesResolved: int
    avgResponseTime: float
    userSatisfaction: int
    conversationsCompleted: int

class AgentRecommendation(BaseModel):
    """Recommendation provided by an agent"""
    id: int
    title: str
    description: str
    impact: str
    category: str
