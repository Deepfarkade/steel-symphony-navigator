
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { hasTableData, hasSummary, getSuggestedQuestions } from '@/utils/chatUtils';

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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // For debugging
  useEffect(() => {
    console.log("Current messages in ChatMessageList:", messages);
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-ey-black/90 py-4 space-y-1">
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id || `message-${index}`}
          id={message.id || `message-${index}`}
          role={message.role}
          content={message.content}
          timestamp={message.timestamp}
          tableData={message.table_data}
          summary={message.summary}
          suggestedQuestions={message.next_question}
          onSuggestedQuestionClick={onSuggestedQuestionClick}
        />
      ))}
      
      {isLoading && (
        <ChatMessage
          role="assistant"
          content=""
          isLoading={true}
        />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
