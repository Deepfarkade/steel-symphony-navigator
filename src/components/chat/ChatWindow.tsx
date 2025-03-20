import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  floating = false
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
    onSendMessage(message, activeSessionId);
  };

  // Get active session messages
  const activeSession = sessions.find(session => session.id === activeSessionId) || sessions[0];

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' });
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
        toggleSidebar={() => setShowSidebar(!showSidebar)}
        showSidebar={showSidebar}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div 
          className={`absolute top-0 left-0 h-full z-10 border-r border-gray-100 
            transition-all duration-300 ease-in-out bg-white dark:bg-gray-900
            ${showSidebar ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none'}
          `}
        >
          <div className="p-3">
            <Button 
              onClick={handleNewSession}
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="p-2 space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full text-left p-2 rounded-lg flex items-center ${
                    activeSessionId === session.id 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <div className="font-medium truncate">{session.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(session.createdAt)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Toggle sidebar button */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${showSidebar ? 'left-64' : 'left-0'} z-20 transition-all duration-300`}>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6 rounded-full border border-gray-200 bg-white shadow-md"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        </div>
        
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
            messages={activeSession.messages}
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
