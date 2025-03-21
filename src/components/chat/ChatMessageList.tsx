
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

  // Auto-scroll to bottom on new messages but contained within the chat area
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
    <ScrollArea className="flex-1 h-full bg-white dark:bg-ey-black/90">
      <div className="py-4 space-y-1 px-4">
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
