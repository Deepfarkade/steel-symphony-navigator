
import { useState, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const useChatSession = (moduleContext?: string, agentId?: number) => {
  const { 
    chatSessions, 
    currentSessionId, 
    isLoading, 
    sendMessage 
  } = useChatContext();

  const [fullscreen, setFullscreen] = useState(false);

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
