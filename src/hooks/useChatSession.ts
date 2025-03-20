
import { useState, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChatSession = (moduleContext?: string, agentId?: number) => {
  const [fullscreen, setFullscreen] = useState(false);
  const navigate = useNavigate();
  
  // Try to get context, but handle the case when it's not available
  let contextValues;
  try {
    contextValues = useChatContext();
  } catch (error) {
    // Provide default values when context is not available
    return {
      currentMessages: [{
        text: agentId 
          ? `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`
          : `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel ${moduleContext || 'operations'} today?`,
        isUser: false,
        timestamp: new Date()
      }],
      isLoading: false,
      handleSendMessage: (message: string) => {
        console.warn("Chat context not available, message not sent:", message);
      },
      fullscreen,
      setFullscreen,
      toggleFullscreen: () => {
        console.log("Toggling fullscreen:", !fullscreen);
        setFullscreen(!fullscreen);
      }
    };
  }
  
  const { 
    chatSessions, 
    currentSessionId, 
    isLoading, 
    sendMessage 
  } = contextValues;

  const currentMessages = chatSessions[currentSessionId] || [];

  const handleSendMessage = (message: string, sessionId?: string) => {
    sendMessage(message, sessionId);
    
    // Auto expand to fullscreen on first message if not already expanded
    if (!fullscreen && currentMessages.length <= 1) {
      setFullscreen(true);
    }
  };

  const toggleFullscreen = () => {
    console.log("Toggling fullscreen from", fullscreen, "to", !fullscreen);
    setFullscreen(prev => !prev);
  };

  return {
    currentMessages,
    isLoading,
    handleSendMessage,
    fullscreen,
    setFullscreen,
    toggleFullscreen
  };
};
