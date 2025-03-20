
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatMessageListProps {
  messages: ChatMessageData[];
  isLoading?: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(messages.length);
  const isAutoScrollingRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    if (isAutoScrollingRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Only scroll when new messages are added, not on component mount or page navigation
  useEffect(() => {
    // Only auto-scroll if new messages were added (not on initial render)
    if (messages.length > prevMessagesLengthRef.current) {
      isAutoScrollingRef.current = true;
      scrollToBottom();
    } else {
      isAutoScrollingRef.current = false;
    }
    
    // Update the previous messages length reference
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex space-x-2 p-4 rounded-lg bg-purple-50 self-start max-w-[80%]">
          <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
