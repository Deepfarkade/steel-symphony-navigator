
class PromptQuestion:
    @staticmethod
    def get_similar_question(message, persona):
        """Generate follow-up questions based on the current message and user persona"""
        if persona == "supply_chain":
            return [
                "Tell me more about production capacity optimization",
                "How can I improve supply chain resilience?",
                "What are best practices for just-in-time inventory management?"
            ]
        elif persona == "manufacturing":
            return [
                "How can I reduce production downtime?",
                "What metrics should I track for manufacturing efficiency?",
                "Tell me about predictive maintenance best practices"
            ]
        else:
            # Default questions
            return [
                "Can you help me with demand planning?",
                "What are the best practices for inventory management?",
                "How can I optimize my supply chain?"
            ]
