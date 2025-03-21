
import React, { useState, useEffect } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  agentId?: number;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, agentId }) => {
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const handleSuggestedQuestion = (event: CustomEvent) => {
      const { question } = event.detail;
      setInputText(question);
    };

    // Add event listener for suggested questions
    document.addEventListener('suggest-question', handleSuggestedQuestion as EventListener);
    
    return () => {
      document.removeEventListener('suggest-question', handleSuggestedQuestion as EventListener);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    console.log("Submitting message from input:", inputText);
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
      <div className="flex">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={agentId 
            ? "Ask this agent about specialized steel insights..." 
            : "Ask me about steel operations, production data, or insights..."}
          className="flex-1 border border-ey-lightGray/20 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-r-lg px-4 py-2 flex items-center justify-center hover:bg-indigo-700 transition-colors"
          disabled={isLoading}
          aria-label="Send message"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
