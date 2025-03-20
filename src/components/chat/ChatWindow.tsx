
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

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
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

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
  };

  const handleSendMessage = (message: string) => {
    onSendMessage(message, activeSessionId);
  };

  // Get active session messages
  const activeSession = sessions.find(session => session.id === activeSessionId) || sessions[0];

  return (
    <div className={`ey-card ${floating ? 'fixed bottom-4 right-4 z-50 shadow-xl w-96' : 'w-full'} 
                ${isExpanded ? 'h-[80vh] w-[500px]' : 'h-[500px]'}
                ${isFullscreen ? 'fixed inset-0 w-full h-full rounded-none z-50' : ''}
                flex flex-col transition-all duration-300 ease-in-out`}>
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
      
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <div className="w-64 border-r border-gray-100 flex flex-col h-full">
            <div className="p-3">
              <Button 
                onClick={handleNewSession}
                className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
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
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">{session.name}</div>
                      <div className="text-xs text-gray-500">
                        {session.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
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
