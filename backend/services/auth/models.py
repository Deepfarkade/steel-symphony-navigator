
from sqlalchemy import Boolean, Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from core.database.mssql import Base

class User(Base):
    """User model for MSSQL database"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    full_name = Column(String(100))
    hashed_password = Column(String(100))
    is_active = Column(Boolean, default=True)
    role = Column(String(10), default="user")  # 'user' or 'admin'
    allowed_modules = Column(JSON, default=lambda: [])  # List of allowed modules
    allowed_agents = Column(JSON, default=lambda: [])  # List of allowed agent IDs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
