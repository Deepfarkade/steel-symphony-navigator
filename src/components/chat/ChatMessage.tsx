
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, Bot, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { hasTableData, hasSummary, getSuggestedQuestions } from '@/utils/chatUtils';

interface ChatMessageProps {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isLoading?: boolean;
  tableData?: any;
  summary?: string;
  suggestedQuestions?: string[];
  onSuggestedQuestionClick?: (question: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  role, 
  content, 
  timestamp, 
  isLoading = false,
  tableData,
  summary,
  suggestedQuestions = [],
  onSuggestedQuestionClick
}) => {
  const isUser = role === 'user';
  const showTableData = !isUser && tableData;
  const showSummary = !isUser && summary;
  
  // Debug logging
  console.log("ChatMessage rendering:", { role, content: content.substring(0, 50), 
    hasTableData: !!tableData, hasSummary: !!summary, suggestedQuestions });

  // Format timestamp
  const formattedTime = timestamp 
    ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) 
    : '';

  // Render the message content
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2 p-4">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span className="text-indigo-600">Thinking...</span>
        </div>
      );
    }

    return (
      <div className="p-4">
        {/* Render table data if available for bot messages */}
        {showTableData && (
          <div className="mb-4 overflow-x-auto">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Data Results:</h3>
            <div className="border border-gray-200 rounded">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {tableData.records && tableData.records.length > 0 && 
                      Object.keys(tableData.records[0]).map((column, i) => (
                        <th key={i} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {column}
                        </th>
                      ))
                    }
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tableData.records && tableData.records.map((record: any, idx: number) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                      {Object.values(record).map((value: any, i: number) => (
                        <td key={i} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {value !== null && value !== undefined ? String(value) : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* For SQL responses, show the query in a code block */}
        {!isUser && content && content.trim().toLowerCase().startsWith('select') && (
          <div className="mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
            <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              <code>{content}</code>
            </pre>
          </div>
        )}

        {/* For regular bot messages, show the text content only if no table/SQL was rendered */}
        {(!showTableData || (showTableData && !content.trim().toLowerCase().startsWith('select'))) && (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}

        {/* If there's a summary for a table, show it */}
        {showSummary && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
            <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
              Analysis:
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {summary}
            </p>
          </div>
        )}

        {/* Show suggested follow-up questions if available */}
        {!isUser && suggestedQuestions && suggestedQuestions.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Suggested Questions:
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="text-xs text-left bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                  onClick={() => onSuggestedQuestionClick?.(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {timestamp && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {formattedTime}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${isUser ? 'ml-3' : 'mr-3'} flex items-center justify-center bg-gray-200 dark:bg-gray-700`}>
          {isUser ? <User className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
        </div>
        
        <Card className={`${isUser ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-white dark:bg-gray-800'} shadow-sm`}>
          {renderContent()}
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;
