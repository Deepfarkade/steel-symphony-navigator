
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Loader2, Bot } from 'lucide-react';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Only scroll when new messages are added, not on component mount
  useEffect(() => {
    // Only scroll if we have messages and if the messages array length has increased
    if (messages.length > 0 && messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }
    
    // Update the previous messages length reference
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-white w-full h-full">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage 
            key={index}
            text={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))
      )}
      
      {isLoading && (
        <div className="flex justify-start animate-fade-in">
          <div className="flex items-start max-w-[80%]">
            <div className="rounded-full p-2 bg-ey-darkGray text-white mr-2">
              <Bot className="h-5 w-5" />
            </div>
            <div className="rounded-lg p-3 bg-ey-darkGray/10 text-ey-darkGray flex items-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <p>Analyzing data<span className="inline-flex animate-ellipsis">...</span></p>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
