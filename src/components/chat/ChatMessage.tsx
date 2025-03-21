
import React, { useState, useEffect } from 'react';
import { CornerDownRight, Bot, User, Copy, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface SuggestedQuestion {
  text: string;
  onClick: (question: string) => void;
}

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isLoading?: boolean;
  id?: string;
  tableData?: string;
  summary?: string;
  suggestedQuestions?: string[];
  onSuggestedQuestionClick?: (question: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
  isLoading = false,
  id,
  tableData,
  summary,
  suggestedQuestions = [],
  onSuggestedQuestionClick
}) => {
  const [copied, setCopied] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [displaySummary, setDisplaySummary] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSuggestedQuestion = (question: string) => {
    if (onSuggestedQuestionClick) {
      onSuggestedQuestionClick(question);
      
      // Dispatch a custom event that the ChatInput component will listen for
      const event = new CustomEvent('suggest-question', { detail: { question } });
      document.dispatchEvent(event);
    }
  };
  
  // Simulate streaming text for assistant messages with summary
  useEffect(() => {
    // Only animate for assistant messages with summary
    if (role !== 'assistant' || !summary || animationComplete) {
      setAnimatedText(content);
      setAnimationComplete(true);
      return;
    }
    
    // If we have table data, show it immediately, then animate the summary
    if (tableData) {
      setAnimatedText(tableData);
      setTimeout(() => {
        setDisplaySummary(true);
      }, 500);
      return;
    }
    
    // For non-table responses, animate the entire content
    let index = 0;
    const timer = setInterval(() => {
      if (index < content.length) {
        setAnimatedText(prev => prev + content.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setAnimationComplete(true);
      }
    }, 15); // Speed of typing animation
    
    return () => clearInterval(timer);
  }, [content, role, summary, tableData, animationComplete]);
  
  // Animate the summary if we have table data
  useEffect(() => {
    if (!displaySummary || !summary || animationComplete) {
      return;
    }
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < summary.length) {
        setAnimatedText(prev => prev + (index === 0 ? '\n\n' : '') + summary.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setAnimationComplete(true);
      }
    }, 15); // Speed of typing animation
    
    return () => clearInterval(timer);
  }, [displaySummary, summary, animationComplete]);
  
  const formattedTime = timestamp ? new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(timestamp)) : '';
  
  return (
    <div 
      className={cn(
        "py-4 px-6 flex items-start gap-4",
        role === 'user' ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
      )}
      id={id}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        role === 'user' 
          ? "bg-indigo-100 dark:bg-indigo-900" 
          : "bg-purple-100 dark:bg-purple-900"
      )}>
        {role === 'user' 
          ? <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" /> 
          : <Bot className="h-4 w-4 text-purple-600 dark:text-purple-300" />
        }
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {role === 'user' ? 'You' : 'AI Assistant'}
          </span>
          {timestamp && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formattedTime}
            </span>
          )}
        </div>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-pulse h-2 w-2 bg-indigo-600 rounded-full"></div>
              <div className="animate-pulse h-2 w-2 bg-indigo-600 rounded-full delay-75"></div>
              <div className="animate-pulse h-2 w-2 bg-indigo-600 rounded-full delay-150"></div>
            </div>
          ) : (
            <ReactMarkdown>
              {animatedText}
            </ReactMarkdown>
          )}
        </div>
        
        {/* Suggested questions */}
        {role === 'assistant' && suggestedQuestions && suggestedQuestions.length > 0 && animationComplete && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Suggested follow-up questions:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-sm text-left px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center transition-colors"
                >
                  <ChevronRight className="h-3 w-3 mr-1 text-gray-500" />
                  <span className="line-clamp-1">{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Copy button */}
        {!isLoading && content && content.length > 0 && (
          <button 
            onClick={copyToClipboard}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
