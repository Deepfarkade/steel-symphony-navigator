
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessageList, { ChatMessageData } from './ChatMessageList';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import SidebarToggle from './SidebarToggle';

interface ChatMessage {
  id?: string;  // Make this properly optional
  text: string;
  isUser: boolean;
  timestamp: Date;
  table_data?: string | any; // Support both string and structured data
  summary?: string;
  next_question?: string[];
  sender?: 'user' | 'bot'; // For MongoDB compatibility
  session_id?: string;
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
  moduleContext?: string;
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
  messageCount = 0,
  moduleContext
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'default',
      name: 'Current Session',
      messages: messages || [],
      createdAt: new Date()
    }
  ]);
  
  const [activeSessionId, setActiveSessionId] = useState<string>('default');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messagesSent, setMessagesSent] = useState<number>(0);
  
  useEffect(() => {
    console.log("Messages updated in ChatWindow:", messages);
    
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

  useEffect(() => {
    const userMessageCount = messages ? messages.filter(msg => msg.isUser).length : 0;
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
    
    if (!showSidebar) {
      setShowSidebar(true);
    }
  };

  const handleSendMessage = (message: string) => {
    console.log("Sending message in ChatWindow:", message);
    setMessagesSent(prev => prev + 1);
    onSendMessage(message, activeSessionId);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    console.log("Suggested question clicked:", question);
    handleSendMessage(question);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const activeSession = sessions.find(session => session.id === activeSessionId) || sessions[0];
  
  const convertToChatMessageData = (messages: ChatMessage[]): ChatMessageData[] => {
    console.log("Converting messages to ChatMessageData:", messages);
    
    if (!messages || !Array.isArray(messages)) {
      console.warn("Messages is not an array:", messages);
      return [];
    }
    
    return messages.map((msg, index) => {
      if (!msg) {
        console.warn("Invalid message at index", index);
        return {
          id: `empty-msg-${index}`,
          role: 'assistant',
          content: '',
        };
      }
      
      const messageData: ChatMessageData = {
        id: msg.id || `msg-${index}-${Date.now()}`,
        role: msg.isUser || msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text || '',
        timestamp: msg.timestamp,
        table_data: msg.table_data,
        summary: msg.summary,
        next_question: msg.next_question || []
      };
      
      return messageData;
    });
  };

  return (
    <div className={`ey-card ${floating ? 'fixed bottom-4 right-4 z-50 shadow-xl w-96' : 'w-full'} 
                ${isExpanded ? 'h-[80vh] w-[500px]' : 'h-[500px]'}
                ${isFullscreen ? 'fixed inset-0 w-full h-full rounded-none z-50' : ''}
                flex flex-col transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 rounded-lg overflow-hidden isolate`}>
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
        moduleContext={moduleContext}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <ChatSidebar 
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          handleNewSession={handleNewSession}
          showSidebar={showSidebar}
        />
        
        <SidebarToggle 
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
        />
        
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
            onSuggestedQuestionClick={handleSuggestedQuestionClick}
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
