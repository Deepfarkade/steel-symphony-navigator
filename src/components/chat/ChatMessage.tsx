
import React, { useState, useEffect } from 'react';
import { Bot, User, Copy, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isLoading?: boolean;
  id?: string;
  tableData?: string | any; // Support for MongoDB table_data which can be string or object
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
  const [copied, setCopied] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

  const isAssistant = role === 'assistant';
  const formattedTime = timestamp 
    ? new Intl.DateTimeFormat('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }).format(timestamp) 
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    if (onSuggestedQuestionClick) {
      onSuggestedQuestionClick(question);
      setShowSuggestions(false);
    }
  };

  // Reset suggestions visibility when new messages arrive
  useEffect(() => {
    setShowSuggestions(true);
  }, [id]);

  // Helper to format table data from MongoDB
  const formatTableData = (data: any) => {
    if (!data) return null;
    
    // Check if it's already a markdown string
    if (typeof data === 'string') {
      return data;
    }
    
    // If it's a structured object (from MongoDB), convert to markdown table
    if (data.records && Array.isArray(data.records)) {
      try {
        // Extract headers from first record
        const headers = Object.keys(data.records[0]);
        
        // Generate table header
        let markdownTable = '| ' + headers.join(' | ') + ' |\n';
        markdownTable += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
        
        // Generate table rows
        data.records.forEach((record: any) => {
          markdownTable += '| ' + headers.map(h => record[h]).join(' | ') + ' |\n';
        });
        
        return markdownTable;
      } catch (error) {
        console.error("Error formatting table data:", error);
        return JSON.stringify(data);
      }
    }
    
    // Fallback
    return JSON.stringify(data);
  };

  // For debugging
  useEffect(() => {
    console.log(`Message (${role}) rendering:`, { 
      content, 
      hasTableData: !!tableData, 
      hasSummary: !!summary, 
      suggestedQuestions 
    });
  }, [content, role, tableData, summary, suggestedQuestions]);

  return (
    <div
      id={id}
      className={cn(
        "px-4 py-3 flex flex-col",
        isAssistant ? "bg-white dark:bg-gray-800" : "bg-indigo-50 dark:bg-gray-900"
      )}
    >
      <div className="flex items-start">
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center mr-3",
          isAssistant ? "bg-indigo-100" : "bg-indigo-600 text-white"
        )}>
          {isAssistant ? <Bot className="h-4 w-4 text-indigo-600" /> : <User className="h-4 w-4" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <span className="font-medium text-sm">
              {isAssistant ? 'AI Assistant' : 'You'}
            </span>
            {timestamp && (
              <span className="text-xs text-gray-500 ml-2">
                {formattedTime}
              </span>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex items-center space-x-2 text-gray-500 animate-pulse">
              <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {/* For bot messages with table data */}
              {isAssistant && tableData ? (
                <div className="space-y-3">
                  {/* Always show table data if it exists */}
                  <div className="overflow-x-auto bg-gray-50 dark:bg-gray-900 p-2 rounded-md border border-gray-200 dark:border-gray-700">
                    <ReactMarkdown>
                      {formatTableData(tableData)}
                    </ReactMarkdown>
                  </div>
                  
                  {/* Always show summary if it exists along with table_data */}
                  {summary && (
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      <ReactMarkdown>
                        {summary}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ) : (
                /* If no table_data, or this is a user message, just show the text */
                <ReactMarkdown>
                  {content}
                </ReactMarkdown>
              )}
              
              {/* Suggested questions */}
              {isAssistant && suggestedQuestions && suggestedQuestions.length > 0 && showSuggestions && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={`question-${index}`}
                        onClick={() => handleSuggestedQuestionClick(question)}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-indigo-300 dark:hover:bg-gray-600 py-1 px-2 rounded-md flex items-center transition-colors"
                      >
                        <ChevronRight className="h-3 w-3 mr-1" />
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {!isLoading && content && (
          <button
            onClick={copyToClipboard}
            className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors self-start"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
