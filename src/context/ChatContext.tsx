
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '@/services/apiConfig';
import { getMockResponse } from '@/services/mockChatService';

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
  const { user } = useAuth();
  
  const getAuthToken = () => localStorage.getItem('auth-token');

  // Normalize module context to handle spaces correctly
  const normalizedModuleContext = moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : undefined;

  const initializeSession = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;
    
    try {
      setIsLoading(true);
      
      // Try to fetch from backend first
      try {
        let sessionResponse;
        
        if (normalizedModuleContext) {
          sessionResponse = await axios.get(`${API_BASE_URL}/chat/module/${normalizedModuleContext}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (agentId) {
          sessionResponse = await axios.get(`${API_BASE_URL}/chat/agents/${agentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
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
        
        setCurrentSessionId(sessionData.session_id);
        
        const messages: ChatMessage[] = sessionData.messages.map((msg: any) => ({
          text: msg.text,
          isUser: msg.isUser,
          timestamp: new Date(msg.timestamp)
        }));
        
        setChatSessions({
          [sessionData.session_id]: messages
        });
        return;
      } catch (error) {
        console.log("Backend connection failed, using fallback", error);
        // Fall through to fallback
      }
      
      // Fallback to local mock if backend connection fails
      const sessionId = `session-${Date.now()}`;
      setCurrentSessionId(sessionId);
      
      const welcomeMessage = {
        text: agentId 
          ? `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`
          : `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel ${moduleContext || 'operations'} today?`,
        isUser: false,
        timestamp: new Date()
      };
      
      setChatSessions({ 
        [sessionId]: [welcomeMessage] 
      });
      
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
      toast({
        title: "Error",
        description: "Failed to initialize chat. Please try again.",
        variant: "destructive"
      });
      
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
  }, [normalizedModuleContext, agentId, toast]);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      initializeSession();
    }
  }, [initializeSession]);

  useEffect(() => {
    websocketService.connect();

    // Use normalized module context for WebSocket channel name
    const channelName = `chat${normalizedModuleContext ? `-${normalizedModuleContext}` : agentId ? `-agent-${agentId}` : ''}`;
    
    const unsubscribeChatMessages = websocketService.onMessage(channelName, (payload: any) => {
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
  }, [toast, normalizedModuleContext, agentId, currentSessionId]);

  const sendMessage = async (inputText: string, sessionId?: string) => {
    const token = getAuthToken();
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the chat feature.",
        variant: "destructive"
      });
      return;
    }
    
    // Use the provided sessionId or current session
    const targetSessionId = sessionId || currentSessionId;
    console.log(`Sending message to session ${targetSessionId}`);
    
    // If no valid session exists, create one
    if (!targetSessionId || targetSessionId === 'fallback-session') {
      try {
        const newSessionId = await createNewSession(agentId, normalizedModuleContext);
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
    
    // Add user message to the UI immediately
    const userMessage = {
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setChatSessions(prev => {
      const sessionMessages = prev[targetSessionId] || [];
      return {
        ...prev,
        [targetSessionId]: [...sessionMessages, userMessage]
      };
    });
    
    setIsLoading(true);

    // Try to send to backend first
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/${targetSessionId}/send`, {
        text: inputText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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
      
      setIsLoading(false);
      return;
    } catch (error) {
      console.error("Backend API failed, using fallback:", error);
      // Fall through to websocket/mock fallback
    }

    try {
      // First try WebSocket communication
      const channelName = `chat${normalizedModuleContext ? `-${normalizedModuleContext}` : agentId ? `-agent-${agentId}` : ''}`;
      
      websocketService.sendMessage(channelName, { 
        text: inputText,
        moduleContext: normalizedModuleContext,
        agentId,
        sessionId: targetSessionId,
        timestamp: new Date().toISOString(),
        isUser: true
      });
      
      // Then use mock response since backend is not available
      setTimeout(() => {
        const mockResponse = getMockResponse(inputText, normalizedModuleContext);
        
        setChatSessions(prev => {
          const sessionMessages = prev[targetSessionId] || [];
          return {
            ...prev,
            [targetSessionId]: [...sessionMessages, {
              text: mockResponse,
              isUser: false,
              timestamp: new Date()
            }]
          };
        });
        
        setIsLoading(false);
      }, 1000); // Simulate network delay
      
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const createNewSession = async (agentId?: number, moduleContext?: string): Promise<string> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }
    
    try {
      setIsLoading(true);
      
      // Try to create session on backend first
      try {
        const response = await axios.post(`${API_BASE_URL}/chat/sessions`, {
          module: moduleContext,
          agent_id: agentId,
          metadata: {}
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const newSessionId = response.data.session_id;
        
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
        console.log("Backend connection failed for new session, using fallback");
        // Fall through to fallback
      }
      
      // Fallback to local mock if backend connection fails
      const sessionId = `session-${Date.now()}`;
      
      const welcomeMessage = {
        text: agentId 
          ? `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`
          : `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel ${moduleContext || 'operations'} today?`,
        isUser: false,
        timestamp: new Date()
      };
      
      setChatSessions(prev => ({
        ...prev,
        [sessionId]: [welcomeMessage]
      }));
      
      setCurrentSessionId(sessionId);
      return sessionId;
      
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
