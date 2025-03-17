
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot, User, Loader2 } from 'lucide-react';
import { generateAIResponse } from '../services/aiService';

interface AiChatInterfaceProps {
  moduleContext?: string;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AiChatInterface: React.FC<AiChatInterfaceProps> = ({ moduleContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: `Hello! I'm your Steel Co-Pilot AI assistant. How can I help you with steel ${moduleContext || 'operations'} today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await generateAIResponse(inputText, moduleContext);
      
      const aiMessage = {
        text: response.text,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ey-card p-6 flex flex-col h-[500px]">
      <h2 className="text-xl font-bold text-ey-darkGray mb-4">AI Assistant</h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`rounded-full p-2 ${message.isUser ? 'bg-ey-yellow text-ey-darkGray ml-2' : 'bg-ey-darkGray text-white mr-2'}`}>
                {message.isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div 
                className={`rounded-lg p-3 ${
                  message.isUser 
                    ? 'bg-ey-yellow/10 text-ey-darkGray' 
                    : 'bg-ey-darkGray/10 text-ey-darkGray'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs text-ey-lightGray mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start max-w-[80%]">
              <div className="rounded-full p-2 bg-ey-darkGray text-white mr-2">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-lg p-3 bg-ey-darkGray/10 text-ey-darkGray flex items-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <p>Thinking...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about steel operations, production data, or insights..."
          className="flex-1 border border-ey-lightGray/20 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ey-yellow"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-ey-yellow text-ey-darkGray rounded-r-lg px-4 py-2 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
};

export default AiChatInterface;
