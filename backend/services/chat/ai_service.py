
import asyncio
import logging
import uuid
from typing import Dict, List, Optional, Any, Union

from config.settings import get_settings
from services.ai.azure_openai import get_completion_from_azure

# Import our new microservices
from .utils.logger import SessionLogger
from .cache.cache_service import CacheService
from .queue.request_queue import RequestQueue
from .session.session_manager import SessionManager
from .processing.message_processor import MessageProcessor
from .response.response_formatter import ResponseFormatter

settings = get_settings()

class AIService:
    # Class variable for thread pools
    _processing_pools = {}
    
    def __init__(self):
        # Initialize services
        self.cache_service = CacheService()
        self.request_queue = RequestQueue()
        self.session_manager = SessionManager.get_instance()
        self.message_processor = MessageProcessor(self.session_manager, self.cache_service)
        self.response_formatter = ResponseFormatter()
        
        # Configure Azure OpenAI settings
        self._configure_environment()
        
        logging.info("AI Service initialized successfully")
    
    def _configure_environment(self):
        """Configure environment variables and settings"""
        # In a real implementation, this would set up environment variables
        # and configure necessary services
        pass
    
    async def get_ai_response(
        self, 
        message: str, 
        conversation_history: List[Dict[str, Any]], 
        module: Optional[str] = None, 
        agent_id: Optional[int] = None,
        user_id: str = "anonymous",
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get AI response asynchronously with context management"""
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())
            
        try:
            SessionLogger.log(session_id, 'message', f'Processing new request from user {user_id[:6] if len(user_id) >= 6 else user_id}')
            
            # Check cache
            SessionLogger.log(session_id, 'cache', 'Checking cache for response')
            cache_key = f"{message}_{module}_{agent_id}"
            cached_response = await self.cache_service.get_cached_response(cache_key)
            if cached_response:
                SessionLogger.log(session_id, 'cache_hit', 'Response found in cache')
                return self.response_formatter.ensure_valid_response(cached_response)
            SessionLogger.log(session_id, 'cache_miss', 'No cached response found')

            # Prepare current user info
            current_user = {'user_id': user_id}
            
            # Enqueue request
            request_key = await self.request_queue.enqueue_request(session_id, user_id, message)
            SessionLogger.log(session_id, 'queue', f'Request enqueued with key: {request_key[:8]}...')
            
            # Start processing asynchronously
            asyncio.create_task(
                self.request_queue.process_request(
                    request_key,
                    self.message_processor.process_request,
                    user_id,
                    session_id,
                    message,
                    current_user
                )
            )

            SessionLogger.log(session_id, 'process', 'Waiting for response generation')
            # Wait for the result with timeout
            response = await self.request_queue.get_result(request_key, timeout=120.0)
            SessionLogger.log(session_id, 'success', 'Response successfully generated', 'success')
            
            # Return the validated response
            return self.response_formatter.ensure_valid_response(response)

        except Exception as e:
            SessionLogger.log(session_id, 'error', f'AI Service error: {str(e)}', 'error')
            logging.error(f"Error in get_ai_response: {str(e)}")
            return self.response_formatter.ensure_valid_response({
                "text": "I'm sorry, I couldn't process your request at the moment. Please try again later.",
                "next_question": [
                    "Can you help me with demand planning?",
                    "What are the best practices for inventory management?",
                    "How can I optimize my supply chain?"
                ]
            })

    async def cleanup_session(self, session_id: str):
        """Clean up session resources"""
        await self.message_processor.cleanup_session(session_id)

# Create a singleton instance for the application
_ai_service_instance = None

def get_ai_service():
    global _ai_service_instance
    if _ai_service_instance is None:
        _ai_service_instance = AIService()
    return _ai_service_instance

async def get_ai_response(
    message: str, 
    conversation_history: List[Dict[str, Any]], 
    module: Optional[str] = None, 
    agent_id: Optional[int] = None
) -> Dict[str, Any]:
    """
    Get an AI response to a user message using the AIService
    
    Args:
        message: The user's message
        conversation_history: Previous messages in the conversation
        module: Optional module context
        agent_id: Optional AI agent ID
        
    Returns:
        Dict: AI response with text, table_data (if applicable), and other fields
    """
    service = get_ai_service()
    
    # Generate a session ID if one doesn't exist in the conversation history
    session_id = None
    if conversation_history and len(conversation_history) > 0:
        session_id = conversation_history[0].get("session_id")
    
    if not session_id:
        session_id = str(uuid.uuid4())
    
    # Get user ID from conversation if available
    user_id = "anonymous"
    
    response = await service.get_ai_response(
        message=message,
        conversation_history=conversation_history,
        module=module,
        agent_id=agent_id,
        user_id=user_id,
        session_id=session_id
    )
    
    return response
