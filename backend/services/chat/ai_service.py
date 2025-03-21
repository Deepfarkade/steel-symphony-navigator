
import asyncio
import logging
import os
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List, Optional, Any, Union

from config.settings import get_settings
from services.ai.azure_openai import get_completion_from_azure

settings = get_settings()

# Session Logger for tracking requests
class SessionLogger:
    @staticmethod
    def log(session_id: str, log_type: str, message: str, level: str = "info"):
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{level.upper()}] [Session: {session_id[:8]}...] [{log_type}] {message}")

    @staticmethod
    def progress(current: int, total: int, message: str, session_id: str):
        percent = int((current / total) * 100)
        print(f"[PROGRESS] [Session: {session_id[:8]}...] {percent}% - {message}")

# Cache service for storing responses
class CacheService:
    def __init__(self):
        self.cache = {}
        self.ttl = 3600  # 1 hour cache TTL

    async def get_cached_response(self, key: str) -> Optional[Dict]:
        """Get response from cache if it exists and is not expired"""
        if key in self.cache:
            timestamp, response = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return response
            else:
                # Remove expired cache entry
                del self.cache[key]
        return None

    async def set_cached_response(self, key: str, response: Dict):
        """Cache a response with current timestamp"""
        self.cache[key] = (time.time(), response)

# Request queue for managing concurrent requests
class RequestQueue:
    def __init__(self):
        self.pending_requests = {}
        self.results = {}
        self.lock = asyncio.Lock()

    async def enqueue_request(self, session_id: str, user_id: str, message: str) -> str:
        """Add a request to the queue and return its key"""
        request_key = str(uuid.uuid4())
        async with self.lock:
            self.pending_requests[request_key] = {
                'session_id': session_id,
                'user_id': user_id,
                'message': message,
                'status': 'pending',
                'timestamp': time.time()
            }
        return request_key

    async def process_request(self, request_key: str, processor_func, *args, **kwargs):
        """Process a request and store its result"""
        try:
            result = await processor_func(*args, **kwargs)
            async with self.lock:
                self.results[request_key] = {
                    'status': 'completed',
                    'result': result,
                    'timestamp': time.time()
                }
                if request_key in self.pending_requests:
                    del self.pending_requests[request_key]
        except Exception as e:
            logging.error(f"Error processing request {request_key}: {str(e)}")
            async with self.lock:
                self.results[request_key] = {
                    'status': 'error',
                    'error': str(e),
                    'timestamp': time.time()
                }
                if request_key in self.pending_requests:
                    del self.pending_requests[request_key]

    async def get_result(self, request_key: str, timeout: float = 60.0) -> Dict:
        """Wait for and return the result of a request"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            async with self.lock:
                if request_key in self.results:
                    result = self.results[request_key]
                    # Clean up after retrieving
                    del self.results[request_key]
                    if result['status'] == 'completed':
                        return result['result']
                    elif result['status'] == 'error':
                        raise Exception(f"Request processing failed: {result.get('error', 'Unknown error')}")
            await asyncio.sleep(0.1)
        raise TimeoutError(f"Request {request_key} timed out after {timeout} seconds")

# Session manager for handling interpreter instances per session
class SessionManager:
    _instance = None
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def __init__(self):
        self._sessions = {}
        self.session_semaphores = {}
    
    async def get_session_interpreter(self, session_id: str):
        """Get or create a session-specific interpreter"""
        if session_id not in self._sessions:
            # Create temp directory for session
            temp_dir = f"/tmp/session_{session_id}"
            os.makedirs(temp_dir, exist_ok=True)
            
            self._sessions[session_id] = {
                'interpreter': None,  # In real implementation, initialize your interpreter here
                'temp_dir': temp_dir,
                'created_at': time.time()
            }
        
        return self._sessions[session_id]
    
    async def acquire_semaphore(self, session_id: str):
        """Get a semaphore for a session to control concurrent access"""
        if session_id not in self.session_semaphores:
            self.session_semaphores[session_id] = asyncio.Semaphore(1)
        
        await self.session_semaphores[session_id].acquire()
        return self.session_semaphores[session_id]
    
    async def release_semaphore(self, session_id: str):
        """Release the semaphore for a session"""
        if session_id in self.session_semaphores:
            self.session_semaphores[session_id].release()

# Simulated utility classes for demonstration
class TableDataSerializer:
    @staticmethod
    def serialize_records(records):
        """Convert and sanitize records for JSON serialization"""
        return records  # In a real implementation, this would handle special types

class PromptQuestion:
    @staticmethod
    def get_similar_question(message, persona):
        """Generate follow-up questions based on the current message and user persona"""
        # In a real implementation, this would use ML to generate relevant questions
        return [
            "Tell me more about production capacity optimization",
            "How can I improve supply chain resilience?",
            "What are best practices for just-in-time inventory management?"
        ]

class AIService:
    # Class variable for thread pools
    _processing_pools = {}
    
    def __init__(self):
        # Initialize services
        self.cache_service = CacheService()
        self.request_queue = RequestQueue()
        self.session_manager = SessionManager.get_instance()
        
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
                return self._ensure_valid_response(cached_response)
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
                    self._process_request,
                    user_id,
                    session_id,
                    message,
                    conversation_history,
                    module,
                    agent_id,
                    current_user
                )
            )

            SessionLogger.log(session_id, 'process', 'Waiting for response generation')
            # Wait for the result with timeout
            response = await self.request_queue.get_result(request_key, timeout=120.0)
            SessionLogger.log(session_id, 'success', 'Response successfully generated', 'success')
            
            # Return the validated response
            return self._ensure_valid_response(response)

        except Exception as e:
            SessionLogger.log(session_id, 'error', f'AI Service error: {str(e)}', 'error')
            logging.error(f"Error in get_ai_response: {str(e)}")
            return self._ensure_valid_response({
                "text": "I'm sorry, I couldn't process your request at the moment. Please try again later.",
                "next_question": [
                    "Can you help me with demand planning?",
                    "What are the best practices for inventory management?",
                    "How can I optimize my supply chain?"
                ]
            })

    def _ensure_valid_response(self, response: Union[Dict[str, Any], str]) -> Dict[str, Any]:
        """Ensure response has all required fields and correct types"""
        if isinstance(response, str):
            response = {"text": response}
            
        if not isinstance(response, dict):
            response = {}
            
        # Ensure all fields exist with correct types
        base_response = {
            "text": "No response available",
            "table_data": None,
            "summary": None,
            "next_question": []
        }
        
        # Update with actual response
        base_response.update(response)
        
        # Support for legacy 'content' field
        if 'content' in response and not response.get('text'):
            base_response['text'] = response['content']
            
        # Support for legacy 'data' field
        if 'data' in response and not response.get('table_data'):
            base_response['table_data'] = response['data']
            
        # Ensure next_question is always a list
        if not isinstance(base_response["next_question"], list):
            base_response["next_question"] = []
                
        return base_response

    async def _process_request(
        self, 
        user_id: str, 
        session_id: str, 
        message: str, 
        conversation_history: List[Dict[str, Any]],
        module: Optional[str],
        agent_id: Optional[int],
        current_user: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process a single request with proper error handling"""
        try:
            # Get session context
            context_str = f"Module: {module or 'general'}, Agent: {agent_id or 'none'}"
            
            # Extract persona from current_user (if available)
            persona = current_user.get("persona", "default")
            
            # Process the message with caching
            response = await self._process_message_with_cache(
                message,
                context_str,
                persona,
                session_id,
                conversation_history,
                module,
                agent_id
            )
            
            if not isinstance(response, dict):
                response = {
                    "text": str(response),
                    "next_question": []
                }
            
            # Ensure next_question exists and is a list
            if 'next_question' not in response or not isinstance(response['next_question'], list):
                response['next_question'] = []
                
            return response
            
        except Exception as e:
            logging.error(f"Error processing request: {e}")
            return {
                "text": "An error occurred while processing your request.",
                "next_question": [
                    "Can you help me with demand planning?",
                    "What are the best practices for inventory management?",
                    "How can I optimize my supply chain?"
                ]
            }

    async def _process_message_with_cache(
        self, 
        message: str, 
        context_str: str, 
        persona: str, 
        session_id: str,
        conversation_history: List[Dict[str, Any]],
        module: Optional[str],
        agent_id: Optional[int]
    ) -> Dict[str, Any]:
        """Process message with improved concurrency and instance management"""
        semaphore = None
        try:
            # Get session-specific interpreter
            session = await self.session_manager.get_session_interpreter(session_id)
            
            # Check cache first
            cache_key = f"{message}_{module}_{agent_id}"
            cached_response = await self.cache_service.get_cached_response(cache_key)
            if cached_response:
                return cached_response

            # Create processing pool for this session if doesn't exist
            if session_id not in self.__class__._processing_pools:
                max_workers = min(24, (os.cpu_count() or 4) * 2)
                self.__class__._processing_pools[session_id] = ThreadPoolExecutor(max_workers=max_workers)

            # Properly acquire semaphore
            semaphore = await self.session_manager.acquire_semaphore(session_id)
            
            loop = asyncio.get_running_loop()
            try:
                # Process with session-specific executor
                response = await loop.run_in_executor(
                    self.__class__._processing_pools[session_id],
                    self._process_user_message_sync,
                    message,
                    context_str,
                    persona,
                    session_id,
                    conversation_history,
                    module,
                    agent_id
                )

                # Cache successful responses
                if response:
                    await self.cache_service.set_cached_response(cache_key, response)
                
                return response

            finally:
                # Always release semaphore
                if semaphore:
                    await self.session_manager.release_semaphore(session_id)

        except Exception as e:
            logging.error(f"Processing error for session {session_id}: {e}")
            # Ensure semaphore is released on error
            if semaphore:
                await self.session_manager.release_semaphore(session_id)
            raise

    async def cleanup_session(self, session_id: str):
        """Clean up session resources with proper error handling"""
        try:
            if session_id in self.__class__._processing_pools:
                # Shutdown the thread pool
                self.__class__._processing_pools[session_id].shutdown(wait=False)
                del self.__class__._processing_pools[session_id]
            
            # Clean up semaphores
            if session_id in self.session_manager.session_semaphores:
                del self.session_manager.session_semaphores[session_id]
                
            # Clean up temp directory if it exists
            if session_id in self.session_manager._sessions:
                temp_dir = self.session_manager._sessions[session_id].get('temp_dir')
                if temp_dir and os.path.exists(temp_dir):
                    try:
                        import shutil
                        shutil.rmtree(temp_dir)
                    except Exception as e:
                        logging.error(f"Error cleaning up temp directory: {e}")
                
                del self.session_manager._sessions[session_id]
                
        except Exception as e:
            logging.error(f"Error cleaning up session resources: {e}")

    def _process_user_message_sync(
        self, 
        message: str, 
        context_str: str, 
        persona: str, 
        session_id: str, 
        conversation_history: List[Dict[str, Any]],
        module: Optional[str],
        agent_id: Optional[int]
    ) -> Dict[str, Any]:
        """Process message with session-specific interpreter instance"""
        try:
            # Generate suggested follow-up questions
            next_questions = PromptQuestion.get_similar_question(message, persona)
            
            # Check if message is likely requesting data/table information
            data_keywords = ['inventory', 'stock', 'supply', 'materials', 'production', 'data', 'metrics', 'stats', 'statistics', 'numbers']
            is_data_request = any(keyword in message.lower() for keyword in data_keywords)
            
            if is_data_request:
                # Simulate SQL query generation and data processing
                SessionLogger.log(session_id, 'process', 'Detected data request, generating SQL query')
                
                # For demonstration, we're generating a sample SQL query
                extracted_sql = f"SELECT * FROM inventory WHERE module='{module or 'general'}' LIMIT 10;"
                
                # Show progress for the data task
                SessionLogger.progress(10, 100, "Generating SQL query", session_id)
                
                # Simulate data processing delay
                time.sleep(0.5)
                SessionLogger.progress(30, 100, "Executing query", session_id)
                
                # Generate sample table data
                SessionLogger.progress(60, 100, "Processing results", session_id)
                table_data = {
                    "records": [
                        {
                            "Distribution Channel": "OEM",
                            "Sales Office": "Mumbai",
                            "Product Form": "S_HRCF",
                            "Unrestricted Quantity": 2250,
                            "Inspection Quantity": 0,
                            "Blocked Quantity": 125,
                            "In Hand Stock Quantity": 2375
                        },
                        {
                            "Distribution Channel": "OEM",
                            "Sales Office": "Delhi",
                            "Product Form": "CR Coil",
                            "Unrestricted Quantity": 1850,
                            "Inspection Quantity": 200,
                            "Blocked Quantity": 75,
                            "In Hand Stock Quantity": 2125
                        },
                        {
                            "Distribution Channel": "OEM",
                            "Sales Office": "Chennai",
                            "Product Form": "Galvanized",
                            "Unrestricted Quantity": 1625,
                            "Inspection Quantity": 150,
                            "Blocked Quantity": 50,
                            "In Hand Stock Quantity": 1825
                        }
                    ]
                }
                
                # Generate summary
                SessionLogger.progress(80, 100, "Generating summary", session_id)
                summary = "Analysis shows varying stock levels across sales offices. Mumbai has highest inventory of S_HRCF with 2250 units available for unrestricted use. Delhi maintains moderate stock levels of CR Coil, while Chennai has the lowest overall inventory of Galvanized products."
                
                # Final response
                SessionLogger.progress(100, 100, "Preparing response", session_id)
                return {
                    "text": extracted_sql,
                    "table_data": table_data,
                    "summary": summary,
                    "next_question": next_questions
                }
            else:
                # Process text-only response
                formatted_history = []
                for msg in conversation_history:
                    role = "user" if msg.get("isUser", msg.get("sender") == "user") else "assistant"
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
                    completion_text = get_completion_from_azure(
                        messages=formatted_messages,
                        temperature=0.7,
                        max_tokens=800
                    )
                    
                    SessionLogger.log(session_id, 'success', 'Generated text response', 'success')
                    
                    return {
                        "text": completion_text,
                        "next_question": next_questions
                    }
                except Exception as e:
                    logging.error(f"Error getting completion from Azure: {e}")
                    SessionLogger.log(session_id, 'error', f'Azure completion error: {str(e)}', 'error')
                    
                    # Fallback response
                    return {
                        "text": "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
                        "next_question": next_questions
                    }
                
        except Exception as e:
            logging.error(f"Message processing error: {e}")
            SessionLogger.log(session_id, 'error', f'Processing error: {str(e)}', 'error')
            raise

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
