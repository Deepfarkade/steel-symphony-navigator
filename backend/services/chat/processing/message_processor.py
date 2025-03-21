
import asyncio
import logging
import os
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any, Optional, List, Union

from ..utils.logger import SessionLogger
from ..utils.prompt_generator import PromptQuestion
from ..utils.serializers import TableDataSerializer
from ..session.session_manager import SessionManager

class MessageProcessor:
    _processing_pools = {}
    
    def __init__(self, session_manager, cache_service):
        self.session_manager = session_manager
        self.cache_service = cache_service
        self.logger = logging.getLogger(__name__)
    
    async def process_request(self, user_id: str, session_id: str, message: str, current_user: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single request with proper error handling"""
        try:
            # In a real implementation, we'd have a GetContext class
            # For now, we'll just use a simple context string
            context_str = f"User: {user_id}, Session: {session_id}"
            
            # Extract persona from current_user
            persona = current_user.get("persona", "default") if isinstance(current_user, dict) else "default"
            
            response = await self._process_message_with_cache(
                message,
                context_str,
                persona,
                session_id
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
            self.logger.error(f"Error processing request: {e}")
            return {
                "text": "An error occurred while processing your request.",
                "next_question": self._get_default_questions()
            }

    async def _process_message_with_cache(self, message: str, context_str: str, persona: str, session_id: str) -> Dict[str, Any]:
        """Process message with improved concurrency and instance management"""
        semaphore = None
        try:
            # Get session-specific interpreter
            session = await self.session_manager.get_session_interpreter(session_id)
            
            # Check cache first
            cached_response = await self.cache_service.get_cached_response(message)
            if cached_response:
                return cached_response

            # Create processing pool for this session if doesn't exist
            if session_id not in self.__class__._processing_pools:
                max_workers = min(26, (os.cpu_count() or 4) * 5)
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
                    session.get('interpreter')
                )

                # Cache successful responses
                if response:
                    await self.cache_service.set_cached_response(message, response)
                
                return response

            finally:
                # Always release semaphore
                if semaphore:
                    await self.session_manager.release_semaphore(session_id)

        except Exception as e:
            self.logger.error(f"Processing error for session {session_id}: {e}")
            # Ensure semaphore is released on error
            if semaphore:
                await self.session_manager.release_semaphore(session_id)
            raise

    def _process_user_message_sync(self, message: str, context_str: str, persona: str, 
                                 session_id: str, interpreter_instance) -> Dict[str, Any]:
        """Process message with session-specific interpreter instance"""
        try:
            # Generate suggested follow-up questions
            next_question = PromptQuestion.get_similar_question(message, persona)
            
            # Check if message is likely requesting data/table information
            data_keywords = ['inventory', 'stock', 'supply', 'materials', 'production', 'data', 'metrics', 'stats', 'statistics', 'numbers']
            is_data_request = any(keyword in message.lower() for keyword in data_keywords)
            
            if is_data_request:
                # Simulate data processing for demonstration
                return self._process_data_request(message, session_id, next_question, context_str)
            else:
                # Process text-only response
                return self._process_text_request(message, session_id, next_question, context_str)
                
        except Exception as e:
            self.logger.error(f"Message processing error: {e}")
            raise

    def _process_data_request(self, message: str, session_id: str, next_question: list, context_str: str) -> Dict[str, Any]:
        """Process a data/table request"""
        try:
            SessionLogger.log(session_id, 'process', 'Detected data request, generating SQL query')
            
            # For demonstration, we're generating a sample SQL query
            extracted_sql = f"SELECT * FROM inventory WHERE context='{context_str}' LIMIT 10;"
            
            # Show progress for the data task
            total_steps = 100
            current_step = 0
            
            SessionLogger.progress(current_step, total_steps, "Generating SQL query", session_id)
            current_step = 30
            
            # Generate sample table data
            SessionLogger.progress(current_step, total_steps, "Executing query", session_id)
            current_step = 60
            
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
            SessionLogger.progress(current_step, total_steps, "Generating summary", session_id)
            current_step = 90
            
            summary = "Analysis shows varying stock levels across sales offices. Mumbai has highest inventory of S_HRCF with 2250 units available for unrestricted use. Delhi maintains moderate stock levels of CR Coil, while Chennai has the lowest overall inventory of Galvanized products."
            
            # Final response
            SessionLogger.progress(current_step, total_steps, "Preparing response", session_id)
            current_step = 100
            
            ai_response = {
                'text': extracted_sql,
                'table_data': table_data,
                'summary': summary,
                'next_question': next_question
            }
            
            SessionLogger.log(session_id, 'success', 'Response generated successfully', 'success')
            SessionLogger.progress(current_step, total_steps, "Complete", session_id)
            
            return ai_response
            
        except Exception as e:
            self.logger.error(f"Error processing data request: {e}")
            return {
                'text': f"I'm sorry, I encountered an error while processing your data request: {str(e)}",
                'next_question': next_question
            }
    
    def _process_text_request(self, message: str, session_id: str, next_question: list, context_str: str) -> Dict[str, Any]:
        """Process a text-only request"""
        try:
            # In a real implementation, this would use Azure OpenAI or another model
            # For demonstration, we'll generate a static response
            
            # Simulate processing time
            time.sleep(0.5)
            
            # Sample response based on context
            if "supply chain" in message.lower():
                content = "Based on my analysis of supply chain patterns, I recommend optimizing your inventory levels and distribution channels. The data shows potential for a 15% improvement in efficiency."
            elif "production" in message.lower():
                content = "Your production capacity could be enhanced by implementing just-in-time manufacturing principles and reducing changeover times. This could increase output by approximately 20%."
            else:
                content = f"I've analyzed your question about '{message}'. Based on the available data, I recommend focusing on operational efficiency and resource optimization to improve your steel manufacturing processes."
            
            return {
                'text': content,
                'next_question': next_question
            }
        
        except Exception as e:
            self.logger.error(f"Error processing text request: {e}")
            return {
                'text': f"I'm sorry, I encountered an error while processing your request: {str(e)}",
                'next_question': next_question
            }

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
                
        except Exception as e:
            self.logger.error(f"Error cleaning up session resources: {e}")
            
    def _get_default_questions(self) -> List[str]:
        """Get default suggested questions when no specific ones are available"""
        return [
            "How can I optimize my production efficiency?",
            "What are the best practices for inventory management?",
            "Can you analyze my supply chain performance?"
        ]
