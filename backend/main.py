
import os
import uvicorn
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from config.settings import get_settings
from core.database.mongodb import close_mongo_connection, connect_to_mongo
from core.database.mssql import engine, SessionLocal, Base
from services.auth.routes import router as auth_router
from services.chat.routes import router as chat_router
from services.demand_planning.routes import router as demand_planning_router
from services.supply_planning.routes import router as supply_planning_router
from services.order_promising.routes import router as order_promising_router
from services.factory_planning.routes import router as factory_planning_router
from services.inventory_optimization.routes import router as inventory_optimization_router
from services.inventory_liquidation.routes import router as inventory_liquidation_router
from services.logistics.routes import router as logistics_router
from services.risk_management.routes import router as risk_management_router
from services.analytics.routes import router as analytics_router
from services.agents.routes import router as agents_router

settings = get_settings()

# Set up rate limiter
limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB on startup
    await connect_to_mongo()
    yield
    # Close MongoDB connection on shutdown
    await close_mongo_connection()

# Create tables in MSSQL (should be done via migrations in production)
Base.metadata.create_all(bind=engine)

# Setup static files path
static_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if not os.path.exists(static_path):
    os.makedirs(static_path)
    os.makedirs(os.path.join(static_path, "assets"), exist_ok=True)

app = FastAPI(
    title="EY Steel Ecosystem Co-Pilot API",
    description="Backend API for the EY Steel Ecosystem Co-Pilot application",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,  # Disable docs in production
    redoc_url="/redoc" if settings.DEBUG else None  # Disable redoc in production
)

# Add rate limiter middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS with allowed origins from settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(",") if settings.ALLOWED_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=86400,  # 24 hours cache for preflight requests
)

# Mount static files
app.mount("/assets", StaticFiles(directory=os.path.join(static_path, "assets"), html=True), name="assets")

# Include routers from different microservices
app.include_router(auth_router, prefix=f"{settings.API_PREFIX}/auth", tags=["Authentication"])
app.include_router(chat_router, prefix=f"{settings.API_PREFIX}/chat", tags=["Chat"])
app.include_router(demand_planning_router, prefix=f"{settings.API_PREFIX}/demand-planning", tags=["Demand Planning"])
app.include_router(supply_planning_router, prefix=f"{settings.API_PREFIX}/supply-planning", tags=["Supply Planning"])
app.include_router(order_promising_router, prefix=f"{settings.API_PREFIX}/order-promising", tags=["Order Promising"])
app.include_router(factory_planning_router, prefix=f"{settings.API_PREFIX}/factory-planning", tags=["Factory Planning"])
app.include_router(inventory_optimization_router, prefix=f"{settings.API_PREFIX}/inventory-optimization", tags=["Inventory Optimization"])
app.include_router(inventory_liquidation_router, prefix=f"{settings.API_PREFIX}/inventory-liquidation", tags=["Inventory Liquidation"])
app.include_router(logistics_router, prefix=f"{settings.API_PREFIX}/logistics", tags=["Logistics"])
app.include_router(risk_management_router, prefix=f"{settings.API_PREFIX}/risk-management", tags=["Risk Management"])
app.include_router(analytics_router, prefix=f"{settings.API_PREFIX}/analytics", tags=["Analytics"])
app.include_router(agents_router, prefix=f"{settings.API_PREFIX}/agents", tags=["AI Agents"])

@app.get("/", tags=["Health Check"])
@limiter.limit("10/minute")
async def health_check(request: Request):
    """Health check endpoint to verify the API is running"""
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    workers = int(os.getenv("WORKERS", "4"))  # Number of worker processes for increased concurrency
    
    # Start the server with multiple workers for better concurrency
    uvicorn.run(
        "main:app", 
        host=host, 
        port=port, 
        reload=settings.DEBUG,
        workers=workers,
        ssl_keyfile=os.getenv("SSL_KEYFILE") if settings.SSL_ENABLED else None,
        ssl_certfile=os.getenv("SSL_CERTFILE") if settings.SSL_ENABLED else None
    )
