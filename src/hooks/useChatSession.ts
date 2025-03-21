
import { useState, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';
import { createWelcomeMessage } from '@/utils/chatUtils';

export type { ChatMessage };

export const useChatSession = (moduleContext?: string, agentId?: number) => {
  const [fullscreen, setFullscreen] = useState(false);
  const navigate = useNavigate();
  
  // Normalize module context to handle spaces correctly
  const normalizedModuleContext = moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : undefined;
  
  // Try to get context, but handle the case when it's not available
  let contextValues;
  try {
    contextValues = useChatContext();
  } catch (error) {
    console.log("Chat context not available, using fallback mode", { moduleContext: normalizedModuleContext, agentId });
    // Provide default values when context is not available
    return {
      currentMessages: [createWelcomeMessage(agentId, normalizedModuleContext)],
      isLoading: false,
      handleSendMessage: (message: string) => {
        console.warn("Chat context not available, message not sent:", message);
      },
      fullscreen,
      setFullscreen,
      toggleFullscreen: () => {
        console.log("Toggling fullscreen from", fullscreen, "to", !fullscreen);
        const newState = !fullscreen;
        setFullscreen(newState);
        return newState; // Return the new state
      },
      messageCount: 0
    };
  }
  
  const { 
    chatSessions, 
    currentSessionId, 
    isLoading, 
    sendMessage 
  } = contextValues;

  // Handle the case when current session doesn't exist yet
  const currentMessages = currentSessionId && chatSessions[currentSessionId] 
    ? chatSessions[currentSessionId] 
    : [createWelcomeMessage(agentId, normalizedModuleContext)];

  // Count user messages to track interaction
  const messageCount = currentMessages.filter(msg => msg.isUser).length;

  const handleSendMessage = (message: string, sessionId?: string) => {
    // Ensure we have a valid sessionId
    const targetSessionId = sessionId || currentSessionId;
    if (!targetSessionId) {
      console.error("No session ID available for sending message");
      return;
    }
    
    // Pass the normalized module context
    sendMessage(message, targetSessionId, normalizedModuleContext, agentId);
    
    // Auto expand to fullscreen on first message if not already expanded
    if (!fullscreen && currentMessages.length <= 1) {
      setFullscreen(true);
    }
  };

  const toggleFullscreen = () => {
    console.log("Toggling fullscreen from", fullscreen, "to", !fullscreen);
    const newState = !fullscreen;
    setFullscreen(newState);
    return newState; // Return the new state
  };

  return {
    currentMessages,
    isLoading,
    handleSendMessage,
    fullscreen,
    setFullscreen,
    toggleFullscreen,
    messageCount // Add messageCount to the return values
  };
};
