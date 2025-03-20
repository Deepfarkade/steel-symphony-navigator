
import React, { useState, useEffect } from 'react';
import { BrainCircuit } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './chat/ChatWindow';
import { ChatProvider } from '@/context/ChatContext';
import { useChatSession } from '@/hooks/useChatSession';

interface AiChatInterfaceProps {
  moduleContext?: string;
  floating?: boolean;
  agentId?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disableFloatingButton?: boolean;
}

const AiChatInterface: React.FC<AiChatInterfaceProps> = ({ 
  moduleContext, 
  floating = false, 
  agentId,
  isOpen: propIsOpen,
  onOpenChange,
  disableFloatingButton = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(propIsOpen || false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsDrawerOpen(propIsOpen);
    }
  }, [propIsOpen]);

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

  // Wrapper component to avoid hook call issues
  const ChatInterface = () => {
    const { 
      currentMessages,
      isLoading,
      handleSendMessage,
      fullscreen,
      setFullscreen
    } = useChatSession(moduleContext, agentId);

    useEffect(() => {
      setIsFullscreen(fullscreen);
    }, [fullscreen]);

    return (
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
        floating={floating}
      />
    );
  };

  if (!floating) {
    return isFullscreen ? (
      <ChatProvider moduleContext={moduleContext} agentId={agentId}>
        <div className="fixed inset-0 z-50 bg-white">
          <ChatInterface />
        </div>
      </ChatProvider>
    ) : (
      <ChatProvider moduleContext={moduleContext} agentId={agentId}>
        <ChatInterface />
      </ChatProvider>
    );
  }

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
        <ChatProvider moduleContext={moduleContext} agentId={agentId}>
          <ChatInterface />
        </ChatProvider>
      </DrawerContent>
    </Drawer>
  );
};

export default AiChatInterface;
