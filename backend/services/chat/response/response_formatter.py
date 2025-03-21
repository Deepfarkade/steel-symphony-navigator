
import logging
from typing import Dict, Any, List, Optional, Union

class ResponseFormatter:
    """
    This class ensures consistent formatting of AI responses
    before they are sent to the client.
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def ensure_valid_response(self, response: Union[Dict[str, Any], str, None]) -> Dict[str, Any]:
        """
        Ensure the response has all required fields and correct formatting.
        If the response is missing or invalid, returns a fallback response.
        
        Args:
            response: The response to validate and format
            
        Returns:
            A properly formatted response dictionary
        """
        if response is None:
            self.logger.warning("Received None response, returning fallback")
            return self._create_fallback_response()
            
        if isinstance(response, str):
            self.logger.warning("Received string response, converting to dict")
            return {
                "text": response,
                "next_question": [],
                "table_data": None,
                "summary": None
            }
            
        if not isinstance(response, dict):
            self.logger.error(f"Invalid response type: {type(response)}")
            return self._create_fallback_response()
            
        # Ensure required fields exist
        cleaned_response = {
            "text": response.get("text") or response.get("content") or "",
            "next_question": response.get("next_question") or [],
            "table_data": response.get("table_data") or response.get("data"),
            "summary": response.get("summary") or None
        }
        
        # Validate types
        if not isinstance(cleaned_response["text"], str):
            self.logger.warning(f"Invalid text type: {type(cleaned_response['text'])}")
            cleaned_response["text"] = str(cleaned_response["text"])
            
        if not isinstance(cleaned_response["next_question"], list):
            self.logger.warning(f"Invalid next_question type: {type(cleaned_response['next_question'])}")
            cleaned_response["next_question"] = []
            
        # Ensure next_question items are strings
        cleaned_response["next_question"] = [
            str(q) for q in cleaned_response["next_question"] if q is not None
        ]
        
        return cleaned_response
    
    def _create_fallback_response(self) -> Dict[str, Any]:
        """
        Create a fallback response when the actual response is invalid
        
        Returns:
            A dictionary with a fallback message
        """
        return {
            "text": "I'm sorry, I couldn't process your request at the moment. Please try again later.",
            "next_question": [
                "Can you help me with demand planning?",
                "What are the best practices for inventory management?",
                "How can I optimize my supply chain?"
            ],
            "table_data": None,
            "summary": None
        }
