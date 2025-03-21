
import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessageData } from './ChatMessageList';
import ReactMarkdown from 'react-markdown';

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
          <div className="whitespace-pre-line markdown-content">
            <ReactMarkdown
              components={{
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full border border-gray-300 rounded" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-gray-100" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className="py-2 px-4 border-b border-gray-300 text-left font-medium" {...props} />
                ),
                tbody: ({ node, ...props }) => (
                  <tbody {...props} />
                ),
                tr: ({ node, ...props }) => (
                  <tr className="border-b border-gray-200 hover:bg-gray-50" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="py-2 px-4" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-2" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
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
