
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import websocketService from '../services/websocketService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '@/services/apiConfig';
import { getMockChatSession, sendMockMessage } from '@/services/mockChatService';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContextProps {
  chatSessions: Record<string, ChatMessage[]>;
  currentSessionId: string;
  isLoading: boolean;
  sendMessage: (inputText: string, sessionId?: string, moduleContext?: string, agentId?: number) => void;
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
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getAuthToken = () => localStorage.getItem('auth-token');

  // Normalize module context to handle spaces correctly
  const normalizedModuleContext = moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : undefined;

  // Health check function to determine if backend is available
  const checkBackendAvailability = useCallback(async () => {
    try {
      await axios.get(`${API_BASE_URL}/`, { timeout: 3000 });
      return true;
    } catch (error) {
      console.log("Backend health check failed, switching to offline mode", error);
      return false;
    }
  }, []);

  const initializeSession = useCallback(async () => {
    const token = getAuthToken();
    
    try {
      setIsLoading(true);
      
      // Check if backend is available
      const backendAvailable = await checkBackendAvailability();
      setIsBackendAvailable(backendAvailable);
      
      if (backendAvailable && token) {
        let sessionResponse;
        
        if (normalizedModuleContext) {
          console.log(`Fetching module chat session for ${normalizedModuleContext}`);
          sessionResponse = await axios.get(`${API_BASE_URL}/api/v1/chat/module/${normalizedModuleContext}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (agentId) {
          console.log(`Fetching agent chat session for agent ${agentId}`);
          sessionResponse = await axios.get(`${API_BASE_URL}/api/v1/chat/agents/${agentId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          console.log("Creating new general chat session");
          const createResponse = await axios.post(`${API_BASE_URL}/api/v1/chat/sessions`, {
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
      } else {
        // Use mock data when backend is not available
        console.log("Using mock data for chat session", { moduleContext: normalizedModuleContext, agentId });
        const mockSession = getMockChatSession(normalizedModuleContext, agentId);
        
        setCurrentSessionId(mockSession.session_id);
        
        const messages: ChatMessage[] = mockSession.messages.map((msg: any) => ({
          text: msg.text,
          isUser: msg.isUser,
          timestamp: new Date(msg.timestamp)
        }));
        
        setChatSessions({
          [mockSession.session_id]: messages
        });
      }
      
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
      setIsBackendAvailable(false);
      
      toast({
        title: "Offline Mode Activated",
        description: "Operating in offline mode with simulated responses.",
        variant: "default"
      });
      
      // Fallback to mock data
      const mockSession = getMockChatSession(normalizedModuleContext, agentId);
      
      const defaultMessage = {
        text: mockSession.messages[0].text,
        isUser: false,
        timestamp: new Date()
      };
      
      setChatSessions({ [mockSession.session_id]: [defaultMessage] });
      setCurrentSessionId(mockSession.session_id);
      
    } finally {
      setIsLoading(false);
    }
  }, [normalizedModuleContext, agentId, toast, checkBackendAvailability, getAuthToken]);

  useEffect(() => {
    const token = getAuthToken();
    if (token || !isBackendAvailable) {
      initializeSession();
    }
  }, [initializeSession, isBackendAvailable]);

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

  const sendMessage = async (inputText: string, sessionId?: string, moduleContext?: string, agentId?: number) => {
    const token = getAuthToken();
    const targetSessionId = sessionId || currentSessionId;
    const normalizedModule = moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : normalizedModuleContext;
    
    console.log("Sending message:", {
      text: inputText,
      sessionId: targetSessionId,
      moduleContext: normalizedModule,
      agentId
    });
    
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

    if (isBackendAvailable && token) {
      try {
        console.log(`Sending message to session ${targetSessionId}`);
        const response = await axios.post(`${API_BASE_URL}/api/v1/chat/${targetSessionId}/send`, {
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
        
      } catch (error) {
        console.error("Failed to send message to backend, falling back to WebSocket:", error);
        
        // Fall back to WebSocket communication
        const channelName = `chat${normalizedModule ? `-${normalizedModule}` : agentId ? `-agent-${agentId}` : ''}`;
        
        websocketService.sendMessage(channelName, { 
          text: inputText,
          moduleContext: normalizedModule,
          agentId,
          sessionId: targetSessionId,
          timestamp: new Date().toISOString(),
          isUser: true
        });
      }
    } else {
      // If backend is not available, use mock data
      try {
        // Get mock response
        const mockResponse = await sendMockMessage(inputText, normalizedModule, agentId);
        
        // Add the mock AI response to the chat session
        setChatSessions(prev => {
          const sessionMessages = prev[targetSessionId] || [];
          return {
            ...prev,
            [targetSessionId]: [...sessionMessages, {
              text: mockResponse.text,
              isUser: false,
              timestamp: new Date()
            }]
          };
        });
      } catch (error) {
        console.error("Failed to generate mock response:", error);
        
        // As a last resort, use WebSocket
        const channelName = `chat${normalizedModule ? `-${normalizedModule}` : agentId ? `-agent-${agentId}` : ''}`;
        
        websocketService.sendMessage(channelName, { 
          text: inputText,
          moduleContext: normalizedModule,
          agentId,
          sessionId: targetSessionId,
          timestamp: new Date().toISOString(),
          isUser: true
        });
      }
    }
    
    setIsLoading(false);
  };

  const createNewSession = async (agentId?: number, moduleContext?: string): Promise<string> => {
    const token = getAuthToken();
    const normalizedModule = moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : undefined;
    
    try {
      setIsLoading(true);
      
      if (isBackendAvailable && token) {
        const response = await axios.post(`${API_BASE_URL}/api/v1/chat/sessions`, {
          module: normalizedModule,
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
      } else {
        // Use mock data when backend is not available
        const mockSession = getMockChatSession(normalizedModule, agentId);
        
        const welcomeMessages = mockSession.messages.map((msg: any) => ({
          text: msg.text,
          isUser: msg.isUser,
          timestamp: new Date(msg.timestamp)
        }));
        
        setChatSessions(prev => ({
          ...prev,
          [mockSession.session_id]: welcomeMessages
        }));
        
        setCurrentSessionId(mockSession.session_id);
        return mockSession.session_id;
      }
      
    } catch (error) {
      console.error("Failed to create new session:", error);
      setIsBackendAvailable(false);
      
      // Fallback to mock data
      const mockSession = getMockChatSession(normalizedModule, agentId);
      
      setChatSessions(prev => ({
        ...prev,
        [mockSession.session_id]: mockSession.messages.map((msg: any) => ({
          text: msg.text,
          isUser: msg.isUser,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      
      setCurrentSessionId(mockSession.session_id);
      return mockSession.session_id;
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
