
import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessageData } from './ChatMessageList';

interface ChatMessageProps {
  message: ChatMessageData;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`rounded-full p-2 ${isUser ? 'bg-indigo-500 text-white ml-2' : 'bg-ey-darkGray text-white mr-2'}`}>
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
        <div 
          className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-indigo-100 text-ey-darkGray' 
              : 'bg-ey-darkGray/10 text-ey-darkGray'
          }`}
        >
          <p className="whitespace-pre-line">{message.content}</p>
          <p className="text-xs text-ey-lightGray mt-1">
            {message.timestamp instanceof Date 
              ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
