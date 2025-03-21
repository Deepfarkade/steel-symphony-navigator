
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import websocketService from '../services/websocketService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { generateSessionId } from '@/services/mockChatService';
import { 
  ChatContextProps, 
  ChatProviderProps, 
  ChatMessage 
} from '@/types/chat';
import {
  checkBackendAvailability,
  fetchOrCreateChatSession,
  sendMessageToApi,
  createNewChatSession
} from '@/services/chatApiService';
import {
  normalizeModuleContext,
  createWelcomeMessage,
  createUserMessage,
  createErrorMessage
} from '@/utils/chatUtils';

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

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
  const initializationComplete = useRef(false);
  const websocketInitialized = useRef(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const normalizedModuleContext = normalizeModuleContext(moduleContext);

  const checkBackendHealth = useCallback(async () => {
    if (backendCheckAttempted.current) {
      return isBackendAvailable;
    }

    backendCheckAttempted.current = true;
    const available = await checkBackendAvailability();
    setIsBackendAvailable(available);
    return available;
  }, [isBackendAvailable]);

  const initializeSession = useCallback(async () => {
    if (initializationInProgress.current || initializationComplete.current) {
      console.log("Session initialization already in progress or completed, skipping");
      return;
    }
    
    console.log("Starting session initialization...");
    initializationInProgress.current = true;
    
    try {
      setIsLoading(true);
      
      if (!backendCheckAttempted.current) {
        await checkBackendHealth();
      }
      
      try {
        const session = await fetchOrCreateChatSession(
          normalizedModuleContext, 
          agentId, 
          isBackendAvailable
        );
        
        setCurrentSessionId(session.id);
        setChatSessions({
          [session.id]: session.messages
        });
        
        if (!isBackendAvailable && !backendCheckAttempted.current) {
          toast({
            title: "Offline Mode Activated",
            description: "Operating in offline mode with simulated responses.",
            variant: "default"
          });
        }
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
        setIsBackendAvailable(false);
        
        if (!backendCheckAttempted.current) {
          toast({
            title: "Offline Mode Activated",
            description: "Operating in offline mode with simulated responses.",
            variant: "default"
          });
        }
        
        try {
          const fallbackSessionId = generateSessionId();
          const defaultMessage = createWelcomeMessage(agentId, normalizedModuleContext);
          
          setChatSessions({ [fallbackSessionId]: [defaultMessage] });
          setCurrentSessionId(fallbackSessionId);
        } catch (fallbackError) {
          console.error("Even fallback initialization failed:", fallbackError);
        }
      }
      
      initializationComplete.current = true;
      
    } finally {
      setIsLoading(false);
      initializationInProgress.current = false;
      console.log("Session initialization completed");
    }
  }, [normalizedModuleContext, agentId, toast, checkBackendHealth, isBackendAvailable]);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token || backendCheckAttempted.current) {
      initializeSession();
    } else {
      checkBackendHealth().then(() => {
        initializeSession();
      });
    }
  }, [initializeSession, checkBackendHealth]);

  useEffect(() => {
    if (websocketInitialized.current) {
      console.log("WebSocket already initialized, skipping");
      return;
    }
    
    websocketInitialized.current = true;
    console.log("Initializing WebSocket connection...");
    websocketService.connect();

    const channelName = `chat${normalizedModuleContext ? `-${normalizedModuleContext}` : agentId ? `-agent-${agentId}` : ''}`;
    
    const unsubscribeChatMessages = websocketService.onMessage(channelName, (payload: any) => {
      if (!payload.isUser) {
        console.log("Received WebSocket message:", payload);
        
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
              next_question: payload.next_question || [],
              session_id: sessionId
            }]
          };
        });
        
        setIsLoading(false);
      }
    });

    const unsubscribeConnect = websocketService.onConnect(() => {
      console.log("WebSocket connected in ChatContext");
    });

    return () => {
      unsubscribeChatMessages();
      unsubscribeConnect();
      websocketInitialized.current = false;
    };
  }, [toast, normalizedModuleContext, agentId, currentSessionId]);

  const sendMessage = async (inputText: string, sessionId?: string, moduleContext?: string, agentId?: number) => {
    const targetSessionId = sessionId || currentSessionId;
    
    if (!targetSessionId) {
      console.error("No session ID for sending message");
      return;
    }
    
    const normalizedModule = normalizeModuleContext(moduleContext) || normalizedModuleContext;
    
    console.log("Sending message:", {
      text: inputText,
      sessionId: targetSessionId,
      moduleContext: normalizedModule,
      agentId
    });
    
    const userMessage = createUserMessage(inputText);

    setChatSessions(prev => {
      const sessionMessages = prev[targetSessionId] || [];
      return {
        ...prev,
        [targetSessionId]: [...sessionMessages, userMessage]
      };
    });
    
    setIsLoading(true);

    try {
      const channelName = `chat${normalizedModule ? `-${normalizedModule}` : agentId ? `-agent-${agentId}` : ''}`;
      
      websocketService.sendMessage(channelName, { 
        text: inputText,
        moduleContext: normalizedModule,
        agentId,
        sessionId: targetSessionId,
        timestamp: new Date().toISOString(),
        isUser: true
      });
      
      const aiMessage = await sendMessageToApi(
        inputText, 
        targetSessionId, 
        normalizedModule, 
        agentId, 
        isBackendAvailable
      );
      
      setChatSessions(prev => {
        const sessionMessages = prev[targetSessionId] || [];
        return {
          ...prev,
          [targetSessionId]: [...sessionMessages, aiMessage]
        };
      });
    } catch (error) {
      console.error("Error sending message:", error);
      
      setChatSessions(prev => {
        const sessionMessages = prev[targetSessionId] || [];
        return {
          ...prev,
          [targetSessionId]: [...sessionMessages, createErrorMessage()]
        };
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async (agentId?: number, moduleContext?: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      const normalizedModule = normalizeModuleContext(moduleContext);
      
      try {
        const newSession = await createNewChatSession(
          normalizedModule, 
          agentId, 
          isBackendAvailable
        );
        
        setChatSessions(prev => ({
          ...prev,
          [newSession.id]: newSession.messages
        }));
        
        setCurrentSessionId(newSession.id);
        return newSession.id;
      } catch (error) {
        console.error("Failed to create new session:", error);
        setIsBackendAvailable(false);
        
        const fallbackSessionId = generateSessionId();
        setChatSessions(prev => ({
          ...prev,
          [fallbackSessionId]: [createWelcomeMessage(agentId, normalizedModule)]
        }));
        
        setCurrentSessionId(fallbackSessionId);
        return fallbackSessionId;
      }
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
