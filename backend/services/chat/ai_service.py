
from typing import List, Dict, Optional, Any
from services.ai.azure_openai import get_completion_from_azure

async def get_ai_response(
    message: str, 
    conversation_history: List[Dict[str, Any]], 
    module: Optional[str] = None, 
    agent_id: Optional[int] = None
) -> str:
    """
    Get an AI response to a user message using Azure OpenAI
    
    Args:
        message: The user's message
        conversation_history: Previous messages in the conversation
        module: Optional module context
        agent_id: Optional AI agent ID
        
    Returns:
        str: AI response text
    """
    # Convert conversation history to a format Azure OpenAI can use
    formatted_history = []
    for msg in conversation_history:
        role = "user" if msg.get("isUser", False) else "assistant"
        formatted_history.append({
            "role": role,
            "content": msg.get("text", "")
        })
    
    # Add system prompt based on module/agent context
    system_prompt = "You are the EY Steel Ecosystem Co-Pilot, an AI assistant for steel industry professionals."
    
    # Add module-specific context if available
    if module:
        module_name = module.replace("-", " ").title()
        system_prompt += f" You are currently focusing on {module_name} and should provide specific insights on this topic."
    
    # Add agent-specific context if available
    if agent_id:
        system_prompt += f" You are operating as Agent #{agent_id} with specialized knowledge in this domain."
    
    # Format the messages for the Azure OpenAI API
    formatted_messages = [
        {"role": "system", "content": system_prompt},
        *formatted_history,
        {"role": "user", "content": message}
    ]
    
    # Get a response from Azure OpenAI
    try:
        return await get_completion_from_azure(
            messages=formatted_messages,
            temperature=0.7,
            max_tokens=800
        )
    except Exception as e:
        # Fallback response in case of an error
        print(f"Error getting AI response: {str(e)}")
        return "I'm sorry, I'm having trouble processing your request right now. Please try again later."
