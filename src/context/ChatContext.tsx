
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocketService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '@/services/apiConfig';
import { 
  getMockChatSession, 
  sendMockMessage, 
  convertMessageFormat, 
  generateSessionId 
} from '@/services/mockChatService';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  id?: string;
  table_data?: Record<string, any>;
  summary?: string;
  next_question?: string[];
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
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const backendCheckAttempted = useRef(false);
  const initializationInProgress = useRef(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const getAuthToken = () => localStorage.getItem('auth-token');

  // Normalize module context to handle spaces correctly
  const normalizedModuleContext = moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : undefined;

  // Health check function to determine if backend is available
  const checkBackendAvailability = useCallback(async () => {
    // Skip the check if we've already attempted it
    if (backendCheckAttempted.current) {
      return isBackendAvailable;
    }

    try {
      await axios.get(`${API_BASE_URL}/`, { timeout: 3000 });
      backendCheckAttempted.current = true;
      setIsBackendAvailable(true);
      return true;
    } catch (error) {
      console.log("Backend health check failed, switching to offline mode", error);
      backendCheckAttempted.current = true;
      setIsBackendAvailable(false);
      return false;
    }
  }, [isBackendAvailable]);

  const initializeSession = useCallback(async () => {
    // Prevent multiple initializations
    if (initializationInProgress.current) {
      return;
    }
    
    initializationInProgress.current = true;
    const token = getAuthToken();
    
    try {
      setIsLoading(true);
      
      // Only check backend availability if not checked already
      if (!backendCheckAttempted.current) {
        await checkBackendAvailability();
      }
      
      if (isBackendAvailable && token) {
        let sessionResponse;
        let endpointPath;
        
        if (normalizedModuleContext) {
          endpointPath = `/api/v1/chat/module/${normalizedModuleContext}`;
          console.log(`Fetching module chat session for ${normalizedModuleContext} from ${endpointPath}`);
          
          try {
            sessionResponse = await axios.get(`${API_BASE_URL}${endpointPath}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (error) {
            console.error(`Failed to fetch module chat session: ${error}`);
            throw error;
          }
        } else if (agentId) {
          endpointPath = `/api/v1/agents/${agentId}/chat`;
          console.log(`Fetching agent chat session for agent ${agentId} from ${endpointPath}`);
          
          try {
            sessionResponse = await axios.get(`${API_BASE_URL}${endpointPath}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (error) {
            console.error(`Failed to fetch agent chat session: ${error}`);
            throw error;
          }
        } else {
          endpointPath = `/api/v1/chat/sessions`;
          console.log(`Creating new general chat session at ${endpointPath}`);
          
          try {
            const createResponse = await axios.post(`${API_BASE_URL}${endpointPath}`, {
              module: null,
              agent_id: null,
              metadata: {}
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            sessionResponse = { data: createResponse.data };
          } catch (error) {
            console.error(`Failed to create general chat session: ${error}`);
            throw error;
          }
        }
        
        const sessionData = sessionResponse.data;
        console.log("Received session data:", sessionData);
        
        if (!sessionData || !sessionData.id) {
          console.error("Invalid session data received:", sessionData);
          throw new Error("Invalid session data");
        }
        
        setCurrentSessionId(sessionData.id);
        
        // Convert backend message format to frontend format
        const messages: ChatMessage[] = (sessionData.messages || []).map((msg: any) => ({
          id: msg.id || uuidv4(),
          text: msg.text,
          isUser: msg.sender === "user",
          timestamp: new Date(msg.timestamp),
          table_data: msg.table_data,
          summary: msg.summary,
          next_question: msg.next_question || []
        }));
        
        setChatSessions({
          [sessionData.id]: messages
        });
        
      } else {
        // Use mock data when backend is not available
        console.log("Using mock data for chat session", { moduleContext: normalizedModuleContext, agentId });
        const mockSession = getMockChatSession(normalizedModuleContext, agentId);
        
        if (!mockSession || !mockSession.id) {
          console.error("Invalid mock session:", mockSession);
          throw new Error("Failed to create mock session");
        }
        
        setCurrentSessionId(mockSession.id);
        
        const messages: ChatMessage[] = mockSession.messages.map((msg: any) => ({
          id: msg.id || uuidv4(),
          text: msg.text,
          isUser: msg.sender === "user",
          timestamp: new Date(msg.timestamp),
          table_data: msg.table_data,
          summary: msg.summary,
          next_question: msg.next_question || []
        }));
        
        setChatSessions({
          [mockSession.id]: messages
        });
        
        // Show offline mode toast only once
        if (!backendCheckAttempted.current) {
          toast({
            title: "Offline Mode Activated",
            description: "Operating in offline mode with simulated responses.",
            variant: "default"
          });
        }
      }
      
    } catch (error) {
      console.error("Failed to initialize chat session:", error);
      setIsBackendAvailable(false);
      
      // Show offline mode toast only once
      if (!backendCheckAttempted.current) {
        toast({
          title: "Offline Mode Activated",
          description: "Operating in offline mode with simulated responses.",
          variant: "default"
        });
      }
      
      // Fallback to mock data
      const mockSession = getMockChatSession(normalizedModuleContext, agentId);
      
      if (!mockSession || !mockSession.id) {
        console.error("Invalid mock session after fallback:", mockSession);
        // Last resort - create a simple session
        const fallbackSessionId = generateSessionId();
        
        const defaultMessage = {
          id: uuidv4(),
          text: "Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you today?",
          isUser: false,
          timestamp: new Date()
        };
        
        setChatSessions({ [fallbackSessionId]: [defaultMessage] });
        setCurrentSessionId(fallbackSessionId);
      } else {
        const messages: ChatMessage[] = mockSession.messages.map((msg: any) => ({
          id: msg.id || uuidv4(),
          text: msg.text,
          isUser: msg.sender === "user",
          timestamp: new Date(msg.timestamp),
          table_data: msg.table_data,
          summary: msg.summary,
          next_question: msg.next_question || []
        }));
        
        setChatSessions({ [mockSession.id]: messages });
        setCurrentSessionId(mockSession.id);
      }
      
    } finally {
      setIsLoading(false);
      initializationInProgress.current = false;
    }
  }, [normalizedModuleContext, agentId, toast, checkBackendAvailability, getAuthToken, isBackendAvailable]);

  useEffect(() => {
    const token = getAuthToken();
    // Only initialize if we have a token or we know backend is unavailable
    if (token || backendCheckAttempted.current) {
      initializeSession();
    } else {
      // Check backend availability first
      checkBackendAvailability().then(() => {
        initializeSession();
      });
    }
  }, [initializeSession, checkBackendAvailability]);

  useEffect(() => {
    websocketService.connect();

    // Use normalized module context for WebSocket channel name
    const channelName = `chat${normalizedModuleContext ? `-${normalizedModuleContext}` : agentId ? `-agent-${agentId}` : ''}`;
    
    const unsubscribeChatMessages = websocketService.onMessage(channelName, (payload: any) => {
      if (!payload.isUser) {
        console.log("Received WebSocket message:", payload);
        
        // Ensure we have a valid session ID
        const sessionId = payload.sessionId || currentSessionId;
        if (!sessionId) {
          console.error("No session ID for incoming message");
          return;
        }
        
        setChatSessions(prev => {
          const sessionMessages = prev[sessionId] || [];
          
          return {
            ...prev,
            [sessionId]: [...sessionMessages, {
              id: payload.id || uuidv4(),
              text: payload.text,
              isUser: false,
              timestamp: new Date(payload.timestamp),
              table_data: payload.table_data,
              summary: payload.summary,
              next_question: payload.next_question || []
            }]
          };
        });
        
        setIsLoading(false);
      }
    });

    const unsubscribeConnect = websocketService.onConnect(() => {
      console.log("WebSocket connected");
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
    
    if (!targetSessionId) {
      console.error("No session ID for sending message");
      return;
    }
    
    const normalizedModule = moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : normalizedModuleContext;
    
    console.log("Sending message:", {
      text: inputText,
      sessionId: targetSessionId,
      moduleContext: normalizedModule,
      agentId
    });
    
    // Add user message to state immediately
    const userMessage: ChatMessage = {
      id: uuidv4(),
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
        const sendEndpoint = `/api/v1/chat/${targetSessionId}/send`;
        
        const response = await axios.post(`${API_BASE_URL}${sendEndpoint}`, {
          text: inputText
        }, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 // 10 second timeout
        });
        
        if (!response.data) {
          throw new Error("Empty response from backend");
        }
        
        console.log("Received response:", response.data);
        
        // Convert backend message format to frontend format
        const aiMessage: ChatMessage = {
          id: response.data.id || uuidv4(),
          text: response.data.text,
          isUser: false,
          timestamp: new Date(response.data.timestamp),
          table_data: response.data.table_data,
          summary: response.data.summary,
          next_question: response.data.next_question || []
        };
        
        setChatSessions(prev => {
          const sessionMessages = prev[targetSessionId] || [];
          return {
            ...prev,
            [targetSessionId]: [...sessionMessages, aiMessage]
          };
        });
        setIsLoading(false);
        
      } catch (error) {
        console.error("Failed to send message to backend, falling back to WebSocket:", error);
        
        // Try WebSocket first
        const channelName = `chat${normalizedModule ? `-${normalizedModule}` : agentId ? `-agent-${agentId}` : ''}`;
        
        websocketService.sendMessage(channelName, { 
          text: inputText,
          moduleContext: normalizedModule,
          agentId,
          sessionId: targetSessionId,
          timestamp: new Date().toISOString(),
          isUser: true
        });
        
        // If WebSocket doesn't deliver in 3 seconds, use mock data
        setTimeout(async () => {
          if (isLoading) {
            console.log("WebSocket response timeout, using mock data");
            try {
              // Get mock response
              const mockResponse = await sendMockMessage(inputText, normalizedModule, agentId);
              
              // Add the mock AI response to the chat session
              setChatSessions(prev => {
                const sessionMessages = prev[targetSessionId] || [];
                return {
                  ...prev,
                  [targetSessionId]: [...sessionMessages, {
                    id: mockResponse.id,
                    text: mockResponse.text,
                    isUser: false,
                    timestamp: new Date(),
                    table_data: mockResponse.table_data,
                    summary: mockResponse.summary,
                    next_question: mockResponse.next_question
                  }]
                };
              });
              
              setIsLoading(false);
            } catch (mockError) {
              console.error("Failed to generate mock response:", mockError);
              setIsLoading(false);
            }
          }
        }, 3000); // Wait 3 seconds for WebSocket response before using mock data
      }
    } else {
      // If backend is not available, use mock data immediately
      try {
        // Simulate a small delay to make it feel more realistic
        setTimeout(async () => {
          // Get mock response
          const mockResponse = await sendMockMessage(inputText, normalizedModule, agentId);
          
          // Add the mock AI response to the chat session
          setChatSessions(prev => {
            const sessionMessages = prev[targetSessionId] || [];
            return {
              ...prev,
              [targetSessionId]: [...sessionMessages, {
                id: mockResponse.id,
                text: mockResponse.text,
                isUser: false,
                timestamp: new Date(),
                table_data: mockResponse.table_data,
                summary: mockResponse.summary,
                next_question: mockResponse.next_question
              }]
            };
          });
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to generate mock response:", error);
        setIsLoading(false);
      }
    }
  };

  const createNewSession = async (agentId?: number, moduleContext?: string): Promise<string> => {
    const token = getAuthToken();
    const normalizedModule = moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : undefined;
    
    try {
      setIsLoading(true);
      
      if (isBackendAvailable && token) {
        const endpoint = `/api/v1/chat/sessions`;
        console.log(`Creating new session at ${endpoint}`, { module: normalizedModule, agent_id: agentId });
        
        try {
          const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
            module: normalizedModule,
            agent_id: agentId,
            metadata: {}
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (!response.data || !response.data.id) {
            throw new Error("Invalid session data in response");
          }
          
          const newSessionId = response.data.id;
          
          // Convert backend message format to frontend format
          const welcomeMessages = (response.data.messages || []).map((msg: any) => ({
            id: msg.id || uuidv4(),
            text: msg.text,
            isUser: msg.sender === "user",
            timestamp: new Date(msg.timestamp),
            table_data: msg.table_data,
            summary: msg.summary,
            next_question: msg.next_question || []
          }));
          
          setChatSessions(prev => ({
            ...prev,
            [newSessionId]: welcomeMessages
          }));
          
          setCurrentSessionId(newSessionId);
          return newSessionId;
        } catch (error) {
          console.error(`Failed to create new session via API: ${error}`);
          throw error;
        }
      } else {
        // Use mock data when backend is not available
        const mockSession = getMockChatSession(normalizedModule, agentId);
        
        if (!mockSession || !mockSession.id) {
          throw new Error("Failed to create mock session");
        }
        
        const welcomeMessages = mockSession.messages.map((msg: any) => ({
          id: msg.id || uuidv4(),
          text: msg.text,
          isUser: msg.sender === "user",
          timestamp: new Date(msg.timestamp),
          table_data: msg.table_data,
          summary: msg.summary,
          next_question: msg.next_question || []
        }));
        
        setChatSessions(prev => ({
          ...prev,
          [mockSession.id]: welcomeMessages
        }));
        
        setCurrentSessionId(mockSession.id);
        return mockSession.id;
      }
      
    } catch (error) {
      console.error("Failed to create new session:", error);
      setIsBackendAvailable(false);
      
      // Fallback to mock data
      const mockSession = getMockChatSession(normalizedModule, agentId);
      
      if (!mockSession || !mockSession.id) {
        console.error("Invalid mock session in fallback");
        const fallbackSessionId = generateSessionId();
        setChatSessions(prev => ({
          ...prev,
          [fallbackSessionId]: [{
            id: uuidv4(),
            text: "Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you today?",
            isUser: false,
            timestamp: new Date()
          }]
        }));
        
        setCurrentSessionId(fallbackSessionId);
        return fallbackSessionId;
      }
      
      setChatSessions(prev => ({
        ...prev,
        [mockSession.id]: mockSession.messages.map((msg: any) => ({
          id: msg.id || uuidv4(),
          text: msg.text,
          isUser: msg.sender === "user",
          timestamp: new Date(msg.timestamp),
          table_data: msg.table_data,
          summary: msg.summary,
          next_question: msg.next_question || []
        }))
      }));
      
      setCurrentSessionId(mockSession.id);
      return mockSession.id;
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
