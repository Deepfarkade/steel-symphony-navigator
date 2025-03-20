
import React, { createContext, useContext, useState, useEffect } from 'react';
import websocketService from '../services/websocketService';
import { useToast } from '@/hooks/use-toast';

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
  createNewSession: (agentId?: number, moduleContext?: string) => string;
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
  const [chatSessions, setChatSessions] = useState<Record<string, ChatMessage[]>>({
    'default': [{
      text: agentId 
        ? `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`
        : `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel ${moduleContext || 'operations'} today?`,
      isUser: false,
      timestamp: new Date()
    }]
  });
  
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const sendMessage = (inputText: string, sessionId?: string) => {
    const targetSessionId = sessionId || currentSessionId;
    
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

    websocketService.sendMessage(`chat${moduleContext ? `-${moduleContext}` : agentId ? `-agent-${agentId}` : ''}`, { 
      text: inputText,
      moduleContext,
      agentId,
      sessionId: targetSessionId,
      timestamp: new Date().toISOString(),
      isUser: true
    });
  };

  const createNewSession = (agentId?: number, moduleContext?: string): string => {
    const newSessionId = `session-${Date.now()}`;
    
    setChatSessions(prev => {
      return {
        ...prev,
        [newSessionId]: [{
          text: agentId 
            ? `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`
            : `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel ${moduleContext || 'operations'} today?`,
          isUser: false,
          timestamp: new Date()
        }]
      };
    });
    
    setCurrentSessionId(newSessionId);
    return newSessionId;
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
