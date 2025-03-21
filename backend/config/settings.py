
import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings that can be loaded from environment variables"""
    
    # API Config
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # MSSQL Database settings
    MSSQL_SERVER: str = "localhost"
    MSSQL_DATABASE: str = "ey_steel_ecosystem"
    MSSQL_USERNAME: str = "sa"
    MSSQL_PASSWORD: str = ""
    MSSQL_DRIVER: str = "ODBC Driver 17 for SQL Server"
    
    # MongoDB settings
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "ey_steel_ecosystem"
    MONGODB_USER_COLLECTION: str = "users"
    MONGODB_CHAT_COLLECTION: str = "chat_sessions"
    MONGODB_MESSAGE_COLLECTION: str = "chat_messages"
    
    # Authentication
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Azure OpenAI
    AZURE_API_KEY: str = ""
    AZURE_API_BASE: str = ""
    AZURE_API_VERSION: str = "2023-05-15"
    AZURE_DEPLOYMENT_NAME: str = "gpt-4"
    
    # Security
    ALLOWED_ORIGINS: str = "*"  # Comma-separated list of allowed origins
    RATE_LIMIT_PER_MINUTE: int = 60
    SSL_ENABLED: bool = False
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

@lru_cache()
def get_settings():
    """Cached settings to avoid loading .env file on each request"""
    return Settings()
