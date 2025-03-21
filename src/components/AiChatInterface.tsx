
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize, Minimize, X, MessageCircle } from 'lucide-react';
import ChatWindow from './chat/ChatWindow';
import { useChatSession } from '@/hooks/useChatSession';
import { Button } from './ui/button';

interface AiChatInterfaceProps {
  moduleContext?: string;
  agentId?: number;
  disableFloatingButton?: boolean;
  fixedPosition?: boolean;
}

const AiChatInterface: React.FC<AiChatInterfaceProps> = ({
  moduleContext,
  agentId,
  disableFloatingButton = false,
  fixedPosition = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  
  // Normalize module context to handle spaces correctly
  const normalizedModuleContext = moduleContext ? moduleContext.toLowerCase().replace(/\s+/g, '-') : undefined;
  
  const {
    currentMessages,
    isLoading,
    handleSendMessage,
    fullscreen,
    toggleFullscreen,
    messageCount
  } = useChatSession(normalizedModuleContext, agentId);

  // Count user messages
  const userMessageCount = currentMessages.filter(msg => msg.isUser).length;

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const navigateToChat = () => {
    if (agentId) {
      navigate(`/agent/${agentId}/chat`);
    } else if (moduleContext) {
      navigate(`/chat/${normalizedModuleContext}`);
    } else {
      navigate('/chat');
    }
  };

  // Close chat when navigating away if in floating mode
  useEffect(() => {
    if (!fixedPosition) {
      return () => {
        setIsOpen(false);
      };
    }
  }, [fixedPosition]);

  // Always show expanded version in fixed position mode
  useEffect(() => {
    if (fixedPosition) {
      setIsOpen(true);
      setIsExpanded(true);
    }
  }, [fixedPosition]);

  if (fixedPosition) {
    return (
      <ChatWindow
        messages={currentMessages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        agentId={agentId}
        isFullscreen={fullscreen}
        toggleFullscreen={toggleFullscreen}
        handleClose={handleClose}
        navigateToChat={navigateToChat}
        isExpanded={true}
        messageCount={userMessageCount}
      />
    );
  }

  return (
    <>
      {!disableFloatingButton && !isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg z-50 flex items-center justify-center p-0"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {userMessageCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {userMessageCount}
            </span>
          )}
        </Button>
      )}
      
      {isOpen && !fixedPosition && (
        <ChatWindow
          messages={currentMessages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          agentId={agentId}
          isFullscreen={fullscreen}
          toggleFullscreen={toggleFullscreen}
          handleClose={handleClose}
          navigateToChat={navigateToChat}
          isExpanded={isExpanded}
          floating={true}
          messageCount={userMessageCount}
        />
      )}
    </>
  );
};

export default AiChatInterface;
