
from typing import List, Dict, Optional, Any
from services.ai.azure_openai import get_completion_from_azure

async def get_ai_response(
    message: str, 
    conversation_history: List[Dict[str, Any]], 
    module: Optional[str] = None, 
    agent_id: Optional[int] = None
) -> Dict[str, Any]:
    """
    Get an AI response to a user message using Azure OpenAI
    
    Args:
        message: The user's message
        conversation_history: Previous messages in the conversation
        module: Optional module context
        agent_id: Optional AI agent ID
        
    Returns:
        Dict: AI response with text, table_data (if applicable), and other fields
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
        completion_text = await get_completion_from_azure(
            messages=formatted_messages,
            temperature=0.7,
            max_tokens=800
        )
        
        # Check if the response should include a table
        # For demonstration purposes, we'll include a sample table for supply chain queries
        if any(keyword in message.lower() for keyword in ['inventory', 'stock', 'supply', 'materials', 'production']):
            table_data = {
                "records": [
                    {
                        "Factory": "Mumbai",
                        "Material Type": "HR Coil",
                        "Current Stock (tons)": 1250,
                        "Min Stock Level": 500,
                        "Max Stock Level": 2000
                    },
                    {
                        "Factory": "Delhi",
                        "Material Type": "CR Coil",
                        "Current Stock (tons)": 850,
                        "Min Stock Level": 400,
                        "Max Stock Level": 1500
                    },
                    {
                        "Factory": "Chennai",
                        "Material Type": "Galvanized",
                        "Current Stock (tons)": 625,
                        "Min Stock Level": 300,
                        "Max Stock Level": 1200
                    }
                ]
            }
            
            summary = "Enterprise supply planning analysis shows varying stock levels across factories. Mumbai has HR Coil inventory above optimal levels, while Chennai's Galvanized stock is approaching minimum threshold."
            
            # Generate suggested follow-up questions
            next_questions = [
                "How can we optimize inventory levels at the Mumbai factory?",
                "What is the historical consumption rate for CR Coil at Delhi?",
                "What are the lead times for replenishing Galvanized material at Chennai?"
            ]
            
            # Return structured response with table
            return {
                "text": completion_text,
                "table_data": table_data,
                "summary": summary,
                "next_question": next_questions
            }
        else:
            # Return text-only response for non-inventory queries
            return {
                "text": completion_text,
                "next_question": [
                    "Tell me about production capacity optimization",
                    "How can I improve supply chain resilience?",
                    "What are best practices for just-in-time inventory management?"
                ]
            }
    except Exception as e:
        # Fallback response in case of an error
        print(f"Error getting AI response: {str(e)}")
        return {
            "text": "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
            "next_question": [
                "Can you help me with demand planning?",
                "What are the best practices for inventory management?",
                "How can I optimize my supply chain?"
            ]
        }
