
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ChatMessageData {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  table_data?: string | any;
  summary?: string;
  next_question?: string[];
}

interface ChatMessageListProps {
  messages: ChatMessageData[];
  isLoading?: boolean;
  onSuggestedQuestionClick?: (question: string) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ 
  messages, 
  isLoading = false,
  onSuggestedQuestionClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages but contained within the chat area
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use scrollIntoView on the messages end ref, but don't affect parent containers
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, [messages]);

  // Prevent chat scrolling from affecting main page
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    
    if (!scrollArea) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Check if scroll area is at top or bottom before stopping propagation
      const isAtTop = scrollArea.scrollTop === 0;
      const isAtBottom = scrollArea.scrollHeight - scrollArea.scrollTop === scrollArea.clientHeight;
      
      // Only prevent default if we're not at the edges, or if we're scrolling in the right direction
      if (!(isAtTop && e.deltaY < 0) && !(isAtBottom && e.deltaY > 0)) {
        e.stopPropagation();
      }
    };
    
    scrollArea.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      scrollArea.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // For debugging
  useEffect(() => {
    console.log("Current messages in ChatMessageList:", messages);
  }, [messages]);

  // Filter out null/invalid messages
  const validMessages = messages && Array.isArray(messages) 
    ? messages.filter(message => 
        message && 
        message.role !== undefined && 
        (typeof message.content === 'string' || typeof message.content === 'undefined')
      )
    : [];

  return (
    <ScrollArea 
      className="flex-1 h-full bg-white dark:bg-ey-black/90 overflow-hidden"
      ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
    >
      <div className="py-4 space-y-1 px-4 overflow-y-auto">
        {validMessages && validMessages.length > 0 ? (
          validMessages.map((message, index) => (
            <ChatMessage
              key={message.id || `message-${index}`}
              id={message.id || `message-${index}`}
              role={message.role}
              content={message.content || ""}
              timestamp={message.timestamp}
              tableData={message.table_data}
              summary={message.summary}
              suggestedQuestions={message.next_question || []}
              onSuggestedQuestionClick={onSuggestedQuestionClick}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">No messages yet</div>
        )}
        
        {isLoading && (
          <ChatMessage
            role="assistant"
            content=""
            isLoading={true}
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
