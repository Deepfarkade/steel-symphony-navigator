
import React, { useState, useEffect } from 'react';
import { BrainCircuit } from 'lucide-react';
import websocketService from '../services/websocketService';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './chat/ChatWindow';

interface AiChatInterfaceProps {
  moduleContext?: string;
  floating?: boolean;
  agentId?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disableFloatingButton?: boolean;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
}

const AiChatInterface: React.FC<AiChatInterfaceProps> = ({ 
  moduleContext, 
  floating = false, 
  agentId,
  isOpen: propIsOpen,
  onOpenChange,
  disableFloatingButton = false
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(propIsOpen || false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsDrawerOpen(propIsOpen);
    }
  }, [propIsOpen]);

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

  const handleSendMessage = (inputText: string, sessionId?: string) => {
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

    if (Object.keys(chatSessions).length <= 1 && !isFullscreen) {
      setIsFullscreen(true);
    }

    websocketService.sendMessage(`chat${moduleContext ? `-${moduleContext}` : agentId ? `-agent-${agentId}` : ''}`, { 
      text: inputText,
      moduleContext,
      agentId,
      sessionId: targetSessionId,
      timestamp: new Date().toISOString(),
      isUser: true
    });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const navigateToChat = () => {
    if (agentId) {
      navigate(`/agent/${agentId}`);
    } else if (moduleContext) {
      navigate(`/chat/${moduleContext}`);
    } else {
      navigate('/chat');
    }
  };

  const handleClose = () => {
    if (isFullscreen) {
      setIsFullscreen(false);
    } else {
      handleOpenChange(false);
    }
  };

  // Get current session messages
  const currentMessages = chatSessions[currentSessionId] || [];

  // Render chat window directly if not floating
  if (!floating) {
    return isFullscreen ? (
      <div className="fixed inset-0 z-50 bg-white">
        <ChatWindow
          messages={currentMessages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          agentId={agentId}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          handleClose={handleClose}
          navigateToChat={navigateToChat}
          isExpanded={isExpanded}
          floating={false}
        />
      </div>
    ) : (
      <ChatWindow
        messages={currentMessages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        agentId={agentId}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        handleClose={handleClose}
        navigateToChat={navigateToChat}
        isExpanded={isExpanded}
        floating={false}
      />
    );
  }

  // Render chat window in a drawer if floating
  return (
    <Drawer open={isDrawerOpen || isFullscreen} onOpenChange={handleOpenChange}>
      {!disableFloatingButton && (
        <DrawerTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg border-0"
            onClick={() => handleOpenChange(true)}
          >
            <BrainCircuit className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent className={`p-0 max-h-[90vh] ${isFullscreen ? 'h-screen w-screen max-w-full' : ''}`}>
        <ChatWindow
          messages={currentMessages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          agentId={agentId}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          handleClose={handleClose}
          navigateToChat={navigateToChat}
          isExpanded={isExpanded}
          floating={true}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default AiChatInterface;
