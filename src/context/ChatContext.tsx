
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '@/services/apiConfig';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContextProps {
  chatSessions: Record<string, ChatMessage[]>;
  currentSessionId: string;
  isLoading: boolean;
  sendMessage: (inputText: string, sessionId?: string) => void;
  setCurrentSessionId: (sessionId: string) => void;
  createNewSession: (agentId?: number, moduleContext?: string) => Promise<string>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
  moduleContext?: string;
  agentId?: number;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ 
  children, 
  moduleContext, 
  agentId 
}) => {
  const [chatSessions, setChatSessions] = useState<Record<string, ChatMessage[]>>({});
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, token } = useAuth();

  // Initialize or fetch existing session
  const initializeSession = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      
      let sessionResponse;
      
      // Get or create a session based on context
      if (moduleContext) {
        sessionResponse = await axios.get(`${API_BASE_URL}/chat/module/${moduleContext}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (agentId) {
        sessionResponse = await axios.get(`${API_BASE_URL}/chat/agents/${agentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create a default session if no context
        const createResponse = await axios.post(`${API_BASE_URL}/chat/sessions`, {
          module: null,
          agent_id: null,
          metadata: {}
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        sessionResponse = { data: createResponse.data };
      }
      
      const sessionData = sessionResponse.data;
      
      // Initialize with session data
      setCurrentSessionId(sessionData.session_id);
      
      // Convert API messages to our format
      const messages: ChatMessage[] = sessionData.messages.map((msg: any) => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: new Date(msg.timestamp)
      }));
      
      setChatSessions({
        [sessionData.session_id]: messages
      });
      
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
      toast({
        title: "Error",
        description: "Failed to initialize chat. Please try again.",
        variant: "destructive"
      });
      
      // Create a fallback welcome message
      const defaultMessage = {
        text: agentId 
          ? `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`
          : `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel ${moduleContext || 'operations'} today?`,
        isUser: false,
        timestamp: new Date()
      };
      
      const fallbackSessionId = 'fallback-session';
      setChatSessions({ [fallbackSessionId]: [defaultMessage] });
      setCurrentSessionId(fallbackSessionId);
      
    } finally {
      setIsLoading(false);
    }
  }, [token, moduleContext, agentId, toast]);

  useEffect(() => {
    if (token) {
      initializeSession();
    }
  }, [token, initializeSession]);

  useEffect(() => {
    websocketService.connect();

    const unsubscribeChatMessages = websocketService.onMessage(`chat${moduleContext ? `-${moduleContext}` : agentId ? `-agent-${agentId}` : ''}`, (payload: any) => {
      if (!payload.isUser) {
        setChatSessions(prev => {
          const sessionId = payload.sessionId || currentSessionId;
          const sessionMessages = prev[sessionId] || [];
          
          return {
            ...prev,
            [sessionId]: [...sessionMessages, {
              text: payload.text,
              isUser: false,
              timestamp: new Date(payload.timestamp)
            }]
          };
        });
        
        setIsLoading(false);
      }
    });

    const unsubscribeConnect = websocketService.onConnect(() => {
      toast({
        title: "Connected to AI Co-Pilot",
        description: "Real-time AI assistance is now available.",
      });
    });

    return () => {
      unsubscribeChatMessages();
      unsubscribeConnect();
    };
  }, [toast, moduleContext, agentId, currentSessionId]);

  const sendMessage = async (inputText: string, sessionId?: string) => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the chat feature.",
        variant: "destructive"
      });
      return;
    }
    
    const targetSessionId = sessionId || currentSessionId;
    
    if (!targetSessionId || targetSessionId === 'fallback-session') {
      // Create a new session if we don't have a valid one
      try {
        const newSessionId = await createNewSession(agentId, moduleContext);
        sendMessage(inputText, newSessionId);
        return;
      } catch (error) {
        console.error("Failed to create session:", error);
        toast({
          title: "Error",
          description: "Failed to create chat session. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }
    
    const userMessage = {
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    // Update UI immediately with user message
    setChatSessions(prev => {
      const sessionMessages = prev[targetSessionId] || [];
      return {
        ...prev,
        [targetSessionId]: [...sessionMessages, userMessage]
      };
    });
    
    setIsLoading(true);

    try {
      // Send to backend API
      const response = await axios.post(`${API_BASE_URL}/chat/${targetSessionId}/send`, {
        text: inputText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update with AI response
      const aiMessage = {
        text: response.data.text,
        isUser: false,
        timestamp: new Date(response.data.timestamp)
      };
      
      setChatSessions(prev => {
        const sessionMessages = prev[targetSessionId] || [];
        return {
          ...prev,
          [targetSessionId]: [...sessionMessages, aiMessage]
        };
      });
      
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      
      // Also send via websocket as fallback
      websocketService.sendMessage(`chat${moduleContext ? `-${moduleContext}` : agentId ? `-agent-${agentId}` : ''}`, { 
        text: inputText,
        moduleContext,
        agentId,
        sessionId: targetSessionId,
        timestamp: new Date().toISOString(),
        isUser: true
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async (agentId?: number, moduleContext?: string): Promise<string> => {
    if (!token) {
      throw new Error("Authentication required");
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/chat/sessions`, {
        module: moduleContext,
        agent_id: agentId,
        metadata: {}
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newSessionId = response.data.session_id;
      
      // Add initial welcome message
      const welcomeMessages = response.data.messages.map((msg: any) => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: new Date(msg.timestamp)
      }));
      
      setChatSessions(prev => ({
        ...prev,
        [newSessionId]: welcomeMessages
      }));
      
      setCurrentSessionId(newSessionId);
      return newSessionId;
      
    } catch (error) {
      console.error("Failed to create new session:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      chatSessions, 
      currentSessionId, 
      isLoading, 
      sendMessage, 
      setCurrentSessionId,
      createNewSession
    }}>
      {children}
    </ChatContext.Provider>
  );
};
