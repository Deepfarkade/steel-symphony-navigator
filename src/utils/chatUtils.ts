
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';

// Helper function to normalize module context
export const normalizeModuleContext = (moduleContext?: string): string | undefined => {
  return moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : undefined;
};

// Helper function to create a default welcome message
export const createWelcomeMessage = (agentId?: number, moduleContext?: string): ChatMessage => {
  return {
    id: uuidv4(),
    text: agentId 
      ? `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`
      : `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel ${moduleContext || 'operations'} today?`,
    isUser: false,
    timestamp: new Date()
  };
};

// Helper function to create a user message
export const createUserMessage = (text: string): ChatMessage => {
  return {
    id: uuidv4(),
    text,
    isUser: true,
    timestamp: new Date()
  };
};

// Helper function to create an error message
export const createErrorMessage = (): ChatMessage => {
  return {
    id: uuidv4(),
    text: "I'm sorry, I couldn't process your request at the moment. Please try again later.",
    isUser: false,
    timestamp: new Date()
  };
};

// Helper function to convert API message to ChatMessage format
export const convertApiMessageToChatMessage = (messageData: any): ChatMessage => {
  return {
    id: messageData.id || uuidv4(),
    text: messageData.text,
    isUser: messageData.sender === "user",
    timestamp: new Date(messageData.timestamp),
    table_data: messageData.table_data,
    summary: messageData.summary,
    next_question: messageData.next_question || [],
    session_id: messageData.session_id
  };
};
