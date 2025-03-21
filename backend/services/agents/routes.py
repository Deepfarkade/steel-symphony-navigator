
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database.mssql import get_db
from core.security.auth import get_current_active_user, get_admin_user, has_agent_access
from services.agents.models import Agent, UserAgent
from services.agents.schemas import AgentCreate, AgentResponse, AgentAnalytics, AgentRecommendation
from services.auth.models import User

router = APIRouter()

@router.get("/available", response_model=List[AgentResponse])
async def get_available_agents(db: Session = Depends(get_db)):
    """
    Get all available agents that users can add to their account
    """
    agents = db.query(Agent).all()
    return agents

@router.get("/deployed", response_model=List[AgentResponse])
async def get_user_agents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all agents deployed by the current user
    """
    # Admin can see all agents
    if current_user.role == "admin":
        user_agents = db.query(UserAgent).filter(UserAgent.user_id == current_user.id).all()
        agent_ids = [ua.agent_id for ua in user_agents]
        agents = db.query(Agent).filter(Agent.id.in_(agent_ids)).all()
        return agents
    
    # Regular users can only see their allowed agents
    allowed_agent_ids = current_user.allowed_agents
    user_agents = db.query(UserAgent).filter(
        UserAgent.user_id == current_user.id,
        UserAgent.agent_id.in_(allowed_agent_ids)
    ).all()
    
    agent_ids = [ua.agent_id for ua in user_agents]
    agents = db.query(Agent).filter(Agent.id.in_(agent_ids)).all()
    return agents

@router.post("/add", status_code=status.HTTP_201_CREATED)
async def add_agent_to_user(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Add an agent to the current user's deployed agents
    """
    # Check if agent exists
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    # Check if user has permission to use this agent
    if current_user.role != "admin" and agent_id not in current_user.allowed_agents:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to use this agent. Please contact your administrator."
        )
    
    # Check if user already has this agent
    existing = db.query(UserAgent).filter(
        UserAgent.user_id == current_user.id,
        UserAgent.agent_id == agent_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Agent already added to user"
        )
    
    # Add agent to user
    user_agent = UserAgent(user_id=current_user.id, agent_id=agent_id)
    db.add(user_agent)
    db.commit()
    
    return {"success": True, "message": "Agent added successfully"}

@router.delete("/remove/{agent_id}", status_code=status.HTTP_200_OK)
async def remove_agent_from_user(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Remove an agent from the current user's deployed agents
    """
    user_agent = db.query(UserAgent).filter(
        UserAgent.user_id == current_user.id,
        UserAgent.agent_id == agent_id
    ).first()
    
    if not user_agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found in user's deployed agents"
        )
    
    db.delete(user_agent)
    db.commit()
    
    return {"success": True, "message": "Agent removed successfully"}

@router.get("/details/{agent_id}", response_model=AgentResponse)
async def get_agent_details(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get detailed information about an agent
    """
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    # If not admin, check if user has access to this agent
    if current_user.role != "admin" and agent_id not in current_user.allowed_agents:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this agent"
        )
    
    return agent

@router.post("/create", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_custom_agent(
    agent_data: AgentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)  # Only admins can create agents
):
    """
    Create a new custom agent (admin only)
    """
    from datetime import datetime
    
    # Create new agent
    new_agent = Agent(
        name=agent_data.name,
        description=agent_data.description,
        icon=agent_data.icon,
        type=agent_data.type,
        confidence=agent_data.confidence,
        compatibility=agent_data.compatibility,
        status=agent_data.status,
        last_updated=datetime.now().strftime("%Y-%m-%d")
    )
    
    db.add(new_agent)
    db.commit()
    db.refresh(new_agent)
    
    # Automatically add to user's agents
    user_agent = UserAgent(user_id=current_user.id, agent_id=new_agent.id)
    db.add(user_agent)
    db.commit()
    
    return new_agent

@router.get("/{agent_id}/analytics", response_model=AgentAnalytics)
async def get_agent_analytics(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get analytics data for an agent
    """
    # Check if agent exists and belongs to user
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    # If not admin, check if user has access to this agent
    if current_user.role != "admin" and agent_id not in current_user.allowed_agents:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this agent's analytics"
        )
    
    user_agent = db.query(UserAgent).filter(
        UserAgent.user_id == current_user.id,
        UserAgent.agent_id == agent_id
    ).first()
    
    if not user_agent and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent not deployed by this user"
        )
    
    # Mock analytics data - in a real implementation, this would be retrieved from a database
    import random
    return AgentAnalytics(
        issuesResolved=random.randint(20, 150),
        avgResponseTime=round(random.uniform(0.5, 5.0), 1),
        userSatisfaction=random.randint(70, 99),
        conversationsCompleted=random.randint(50, 500)
    )

@router.get("/{agent_id}/recommendations", response_model=List[AgentRecommendation])
async def get_agent_recommendations(
    agent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get recommendations from an agent
    """
    # Check if agent exists and belongs to user
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    # If not admin, check if user has access to this agent
    if current_user.role != "admin" and agent_id not in current_user.allowed_agents:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view this agent's recommendations"
        )
    
    user_agent = db.query(UserAgent).filter(
        UserAgent.user_id == current_user.id,
        UserAgent.agent_id == agent_id
    ).first()
    
    if not user_agent and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent not deployed by this user"
        )
    
    # Mock recommendations - in a real implementation, these would be generated by the AI
    return [
        AgentRecommendation(
            id=1,
            title="Optimize Production Schedule",
            description="Adjust production schedule to reduce downtime during shift changes",
            impact="High",
            category="Efficiency"
        ),
        AgentRecommendation(
            id=2,
            title="Energy Efficiency",
            description="Replace outdated equipment in Zone 3 to reduce energy consumption",
            impact="Medium",
            category="Sustainability"
        ),
        AgentRecommendation(
            id=3,
            title="Supply Chain Risk",
            description="Diversify suppliers for critical raw materials to mitigate supply chain disruptions",
            impact="High",
            category="Risk Management"
        )
    ]
