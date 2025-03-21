
from typing import Dict, Any, Union

class ResponseFormatter:
    @staticmethod
    def ensure_valid_response(response: Union[Dict[str, Any], str]) -> Dict[str, Any]:
        """Ensure response has all required fields and correct types"""
        if isinstance(response, str):
            response = {"type": "text", "content": response}
            
        if not isinstance(response, dict):
            response = {}
            
        # Ensure all fields exist with correct types
        base_response = {
            "type": "text",
            "content": "No response available",
            "next_question": [],
            "summary": None,
            "data": None
        }
        
        # Support for legacy field mappings
        if isinstance(response, dict):
            # Update with actual response fields
            base_response.update(response)
            
            # Map text/content fields appropriately
            if 'content' in response and not response.get('text'):
                base_response['text'] = response['content']
            elif 'text' in response and not response.get('content'):
                base_response['content'] = response['text']
            
            # Map data/table_data fields appropriately
            if 'data' in response and not response.get('table_data'):
                base_response['table_data'] = response['data']
            elif 'table_data' in response and not response.get('data'):
                base_response['data'] = response['table_data']
            
            # Ensure next_question is always a list
            if not isinstance(base_response["next_question"], list):
                base_response["next_question"] = []
                
        return base_response
