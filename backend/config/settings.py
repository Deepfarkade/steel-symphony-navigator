
import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings that can be loaded from environment variables"""
    
    # API Config
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # MSSQL Database settings
    MSSQL_SERVER: str = "localhost"
    MSSQL_DATABASE: str = "ey_steel_ecosystem"
    MSSQL_USERNAME: str = "sa"
    MSSQL_PASSWORD: str = ""
    MSSQL_DRIVER: str = "ODBC Driver 17 for SQL Server"
    
    # MongoDB settings
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "ey_steel_ecosystem"
    
    # Authentication
    SECRET_KEY: str = "supersecretkey"  # Change this in production!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

@lru_cache()
def get_settings():
    """Cached settings to avoid loading .env file on each request"""
    return Settings()
