
import React, { useState, useEffect } from 'react';
import { BrainCircuit } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './chat/ChatWindow';
import { ChatProvider } from '@/context/ChatContext';
import { useChatSession } from '@/hooks/useChatSession';
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
  const [localFullscreen, setLocalFullscreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsDrawerOpen(propIsOpen);
    }
  }, [propIsOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const navigateToChat = () => {
    // Close drawer or fullscreen before navigating
    if (isDrawerOpen) {
      handleOpenChange(false);
    }
    
    if (localFullscreen) {
      setLocalFullscreen(false);
    }
    
    if (agentId) {
      navigate(`/agent/${agentId}`);
    } else if (moduleContext) {
      navigate(`/chat/${moduleContext}`);
    } else {
      navigate('/chat');
    }
  };

  const handleClose = () => {
    if (localFullscreen) {
      setLocalFullscreen(false);
    } else {
      handleOpenChange(false);
    }
  };

  // ChatInterface component to avoid hook call issues
  const ChatInterface = () => {
    const { 
      currentMessages,
      isLoading,
      handleSendMessage,
      fullscreen,
      setFullscreen,
      toggleFullscreen
    } = useChatSession(moduleContext, agentId);

    // Sync hook state with local state
    useEffect(() => {
      setLocalFullscreen(fullscreen);
    }, [fullscreen]);

    // Sync local state with hook state
    useEffect(() => {
      setFullscreen(localFullscreen);
    }, [localFullscreen, setFullscreen]);

    const handleFullscreenToggle = () => {
      console.log("Toggling fullscreen in AiChatInterface");
      const newState = !localFullscreen;
      setLocalFullscreen(newState);
      // Only update the hook state if using the drawer
      if (floating) {
        // If we're going fullscreen, close the drawer
        if (newState) {
          handleOpenChange(false);
        }
      }
    };

    return (
      <ChatWindow
        messages={currentMessages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        agentId={agentId}
        isFullscreen={localFullscreen}
        toggleFullscreen={handleFullscreenToggle}
        handleClose={handleClose}
        navigateToChat={navigateToChat}
        isExpanded={isExpanded}
        floating={floating}
      />
    );
  };

  // Render the chat interface based on whether it's floating or not
  if (!floating) {
    return (
      <ChatProvider moduleContext={moduleContext} agentId={agentId}>
        <div className={`${localFullscreen ? 'fixed inset-0 z-50 bg-white' : 'w-full h-full'}`}>
          <ChatInterface />
        </div>
      </ChatProvider>
    );
  }

  return (
    <>
      {!disableFloatingButton && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg border-0"
          onClick={() => handleOpenChange(true)}
        >
          <BrainCircuit className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
        </Button>
      )}

      {localFullscreen ? (
        <div className="fixed inset-0 z-50 bg-white">
          <ChatProvider moduleContext={moduleContext} agentId={agentId}>
            <ChatInterface />
          </ChatProvider>
        </div>
      ) : (
        <Drawer open={isDrawerOpen} onOpenChange={handleOpenChange}>
          <DrawerContent className="p-0 max-h-[90vh]">
            <ChatProvider moduleContext={moduleContext} agentId={agentId}>
              <ChatInterface />
            </ChatProvider>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default AiChatInterface;
