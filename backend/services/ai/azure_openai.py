
import os
import json
import httpx
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from config.settings import get_settings

settings = get_settings()

class Message(BaseModel):
    role: str
    content: str

class AzureOpenAIRequest(BaseModel):
    messages: List[Message]
    temperature: float = 0.7
    max_tokens: int = 800
    top_p: float = 0.95
    frequency_penalty: float = 0
    presence_penalty: float = 0
    stop: Optional[List[str]] = None

async def get_completion_from_azure(
    messages: List[Dict[str, str]], 
    deployment_name: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 800
) -> str:
    """
    Get completion from Azure OpenAI
    
    Args:
        messages: List of message dictionaries with 'role' and 'content'
        deployment_name: Optional Azure deployment name to override default
        temperature: Temperature for text generation (0-1)
        max_tokens: Maximum tokens to generate
        
    Returns:
        str: Generated response text
    """
    api_base = settings.AZURE_API_BASE
    api_key = settings.AZURE_API_KEY
    api_version = settings.AZURE_API_VERSION
    
    # Use provided deployment name or default from settings
    deployment = deployment_name or settings.AZURE_DEPLOYMENT_NAME
    
    if not api_base or not api_key or not api_version or not deployment:
        raise ValueError("Azure OpenAI configuration is missing. Check environment variables.")
    
    # Format messages for the API
    formatted_messages = [{"role": msg["role"], "content": msg["content"]} for msg in messages]
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        headers = {
            "Content-Type": "application/json",
            "api-key": api_key
        }
        
        endpoint = f"{api_base}/openai/deployments/{deployment}/chat/completions?api-version={api_version}"
        
        payload = {
            "messages": formatted_messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": 0.95,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "stop": None
        }
        
        try:
            response = await client.post(
                endpoint,
                headers=headers,
                content=json.dumps(payload)
            )
            
            if response.status_code != 200:
                error_detail = response.json().get("error", {}).get("message", "Unknown error")
                raise Exception(f"Azure OpenAI API Error: {response.status_code}, {error_detail}")
            
            result = response.json()
            return result["choices"][0]["message"]["content"]
        
        except Exception as e:
            # Log the error and return a fallback response
            print(f"Error calling Azure OpenAI API: {str(e)}")
            return "I apologize, but I'm unable to process your request at the moment. Please try again later."
