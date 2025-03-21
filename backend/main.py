
import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

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

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB on startup
    await connect_to_mongo()
    yield
    # Close MongoDB connection on shutdown
    await close_mongo_connection()

# Create tables in MSSQL (should be done via migrations in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EY Steel Ecosystem Co-Pilot API",
    description="Backend API for the EY Steel Ecosystem Co-Pilot application",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
async def health_check():
    """Health check endpoint to verify the API is running"""
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
