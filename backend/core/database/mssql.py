
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config.settings import get_settings

settings = get_settings()

# Connection string for Microsoft SQL Server
SQLALCHEMY_DATABASE_URL = (
    f"mssql+pyodbc://{settings.MSSQL_USERNAME}:{settings.MSSQL_PASSWORD}@"
    f"{settings.MSSQL_SERVER}/{settings.MSSQL_DATABASE}?"
    f"driver={settings.MSSQL_DRIVER}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=settings.DEBUG)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """
    Dependency function to get a DB session
    
    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
