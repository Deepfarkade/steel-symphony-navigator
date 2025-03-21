
from sqlalchemy import Boolean, Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database.mssql import Base

class Agent(Base):
    """AI Agent model for MSSQL database"""
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    description = Column(Text)
    status = Column(String(20), default="learning")  # active, learning, inactive
    icon = Column(String(50))
    confidence = Column(Float, default=80.0)
    compatibility = Column(String(20), default="medium")  # high, medium, low
    type = Column(String(50))  # operational, analytical, strategic, custom
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_updated = Column(String(20))  # Date string for UI display

class UserAgent(Base):
    """Mapping between users and their deployed agents"""
    __tablename__ = "user_agents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    agent_id = Column(Integer, ForeignKey("agents.id"))
    added_at = Column(DateTime(timezone=True), server_default=func.now())
