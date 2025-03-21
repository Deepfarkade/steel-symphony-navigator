
import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessageData } from './ChatMessageList';

interface ChatMessageProps {
  message: ChatMessageData;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Function to render markdown tables as HTML
  const renderContent = (content: string) => {
    // Check if the content contains a markdown table (starts with | and has multiple lines)
    if (content.trim().startsWith('|') && content.includes('\n')) {
      try {
        // Split the content by table and non-table sections
        const parts = content.split(/(\n\n|\r\n\r\n)/);
        
        return (
          <>
            {parts.map((part, index) => {
              if (part.trim().startsWith('|') && part.includes('\n')) {
                // This is a table, render it as HTML
                return (
                  <div key={index} className="overflow-x-auto my-2">
                    <table className="w-full border-collapse">
                      {part.trim().split('\n').map((row, rowIndex) => {
                        const cells = row.split('|').filter(cell => cell.trim() !== '');
                        
                        if (rowIndex === 0) {
                          // Header row
                          return (
                            <thead key={`thead-${rowIndex}`}>
                              <tr>
                                {cells.map((cell, cellIndex) => (
                                  <th key={`th-${cellIndex}`} className="border border-gray-300 px-3 py-2 bg-gray-100">
                                    {cell.trim()}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          );
                        } else if (rowIndex === 1 && row.includes('-')) {
                          // Separator row, skip rendering
                          return null;
                        } else {
                          // Data row
                          return (
                            <tr key={`tr-${rowIndex}`}>
                              {cells.map((cell, cellIndex) => (
                                <td key={`td-${cellIndex}`} className="border border-gray-300 px-3 py-2">
                                  {cell.trim()}
                                </td>
                              ))}
                            </tr>
                          );
                        }
                      })}
                    </table>
                  </div>
                );
              } else {
                // This is regular text
                return (
                  <p key={index} className="whitespace-pre-line my-2">
                    {part}
                  </p>
                );
              }
            })}
          </>
        );
      } catch (error) {
        console.error('Error rendering table:', error);
        // Fallback to regular text
        return <p className="whitespace-pre-line">{content}</p>;
      }
    }
    
    // Regular text, just render as is
    return <p className="whitespace-pre-line">{content}</p>;
  };

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
          {renderContent(message.content)}
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
