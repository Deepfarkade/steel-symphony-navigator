
import { useState, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChatSession = (moduleContext?: string, agentId?: number) => {
  const [fullscreen, setFullscreen] = useState(false);
  
  // Try to get context, but handle the case when it's not available
  let contextValues;
  try {
    contextValues = useChatContext();
  } catch (error) {
    // Provide default values when context is not available
    return {
      currentMessages: [],
      isLoading: false,
      handleSendMessage: () => console.warn("Chat context not available"),
      fullscreen,
      setFullscreen
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
    if (!fullscreen && Object.keys(chatSessions).length <= 1) {
      setFullscreen(true);
    }
  };

  return {
    currentMessages,
    isLoading,
    handleSendMessage,
    fullscreen,
    setFullscreen
  };
};
