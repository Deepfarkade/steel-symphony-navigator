
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare } from 'lucide-react';

interface ChatSession {
  id: string;
  name: string;
  createdAt: Date;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  handleNewSession: () => void;
  showSidebar: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  setActiveSessionId,
  handleNewSession,
  showSidebar
}) => {
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  return (
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
  );
};

export default ChatSidebar;
