
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
  console.log("Converting API message:", messageData);
  
  if (!messageData) {
    console.warn("Invalid message data received:", messageData);
    return createErrorMessage();
  }
  
  try {
    // Handle response field variations (content/text, data/table_data)
    let table_data = messageData.table_data || messageData.data || null;
    
    // Handle text field variations (text/content)
    let text = '';
    if (messageData.text !== undefined) {
      text = messageData.text;
    } else if (messageData.content !== undefined) {
      text = messageData.content;
    }
    
    let summary = messageData.summary || null;
    let next_question = Array.isArray(messageData.next_question) ? messageData.next_question : [];
    
    // Determine if this is a user or bot message
    const isUser = messageData.sender === "user" || 
                  messageData.isUser === true || 
                  messageData.role === "user";
    
    return {
      id: messageData.id || uuidv4(),
      text: text,
      isUser: isUser,
      timestamp: new Date(messageData.timestamp || Date.now()),
      table_data: table_data,
      summary: summary,
      next_question: next_question,
      session_id: messageData.session_id
    };
  } catch (error) {
    console.error("Error converting message:", error, "Original message:", messageData);
    return createErrorMessage();
  }
};

// Helper to determine if a message has table data that should be displayed
export const hasTableData = (message: ChatMessage): boolean => {
  return !message.isUser && 
         message.table_data !== undefined && 
         message.table_data !== null;
};

// Helper to determine if a message has a summary that should be displayed
export const hasSummary = (message: ChatMessage): boolean => {
  return !message.isUser && 
         message.summary !== undefined && 
         message.summary !== null && 
         message.summary !== "";
};

// Helper to get suggested questions for display
export const getSuggestedQuestions = (message: ChatMessage): string[] => {
  if (!message.isUser && message.next_question && Array.isArray(message.next_question)) {
    return message.next_question;
  }
  return [];
};

// Safely parse JSON strings if needed
export const safelyParseJSON = (data: any): any => {
  if (typeof data !== 'string') {
    return data;
  }
  
  try {
    return JSON.parse(data);
  } catch (e) {
    console.warn("Failed to parse JSON:", e);
    return data;
  }
};
