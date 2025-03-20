
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList, { ChatMessageData } from './ChatMessageList';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import SidebarToggle from './SidebarToggle';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: Date;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string, sessionId?: string) => void;
  agentId?: number;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  handleClose: () => void;
  navigateToChat: () => void;
  isExpanded: boolean;
  floating?: boolean;
  messageCount?: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  agentId,
  isFullscreen,
  toggleFullscreen,
  handleClose,
  navigateToChat,
  isExpanded,
  floating = false,
  messageCount = 0
}) => {
  // Create mock sessions for demonstration
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'default',
      name: 'Current Session',
      messages: messages,
      createdAt: new Date()
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState<string>('default');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messagesSent, setMessagesSent] = useState<number>(0);

  // Keep messages updated with props
  useEffect(() => {
    if (messages && messages.length > 0) {
      setSessions(prev => {
        const sessionIndex = prev.findIndex(s => s.id === activeSessionId);
        if (sessionIndex >= 0) {
          const updatedSessions = [...prev];
          updatedSessions[sessionIndex] = {
            ...updatedSessions[sessionIndex],
            messages: messages
          };
          return updatedSessions;
        }
        return prev;
      });
    }
  }, [messages, activeSessionId]);

  // Track user messages for navigation
  useEffect(() => {
    // Count user messages in the current session
    const userMessageCount = messages.filter(msg => msg.isUser).length;
    setMessagesSent(userMessageCount);
  }, [messages]);

  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      name: `Chat ${sessions.length + 1}`,
      messages: [{
        text: agentId 
          ? `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`
          : `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you today?`,
        isUser: false,
        timestamp: new Date()
      }],
      createdAt: new Date()
    };
    
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
    
    // Automatically open the sidebar when creating a new session
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const handleSendMessage = (message: string) => {
    setMessagesSent(prev => prev + 1);
    onSendMessage(message, activeSessionId);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Get active session messages
  const activeSession = sessions.find(session => session.id === activeSessionId) || sessions[0];
  
  // Convert ChatMessage[] to ChatMessageData[]
  const convertToChatMessageData = (messages: ChatMessage[]): ChatMessageData[] => {
    return messages.map((msg, index) => ({
      id: `msg-${index}-${Date.now()}`,
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text,
      timestamp: msg.timestamp
    }));
  };

  return (
    <div className={`ey-card ${floating ? 'fixed bottom-4 right-4 z-50 shadow-xl w-96' : 'w-full'} 
                ${isExpanded ? 'h-[80vh] w-[500px]' : 'h-[500px]'}
                ${isFullscreen ? 'fixed inset-0 w-full h-full rounded-none z-50' : ''}
                flex flex-col transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 rounded-lg overflow-hidden`}>
      <ChatHeader 
        agentId={agentId}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        handleClose={handleClose}
        navigateToChat={navigateToChat}
        floating={floating}
        toggleSidebar={toggleSidebar}
        showSidebar={showSidebar}
        messageCount={messageCount || messagesSent}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Component */}
        <ChatSidebar 
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          handleNewSession={handleNewSession}
          showSidebar={showSidebar}
        />
        
        {/* Sidebar Toggle Component */}
        <SidebarToggle 
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
        />
        
        {/* Chat content */}
        <div 
          ref={chatContainerRef}
          className="flex-1 flex flex-col overflow-hidden"
          style={{ 
            marginLeft: showSidebar ? '16rem' : '0',
            width: showSidebar ? 'calc(100% - 16rem)' : '100%',
            transition: 'margin-left 0.3s ease, width 0.3s ease'
          }}
        >
          <ChatMessageList 
            messages={convertToChatMessageData(activeSession.messages)}
            isLoading={isLoading}
          />
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            agentId={agentId}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
