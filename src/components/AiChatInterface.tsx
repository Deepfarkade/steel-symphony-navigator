
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SendHorizontal, Bot, User, Loader2, Sparkles, Brain, Maximize2, Minimize2, X, BrainCircuit } from 'lucide-react';
import websocketService from '../services/websocketService';
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface AiChatInterfaceProps {
  moduleContext?: string;
  floating?: boolean;
  agentId?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AiChatInterface: React.FC<AiChatInterfaceProps> = ({ 
  moduleContext, 
  floating = false, 
  agentId,
  isOpen: propIsOpen,
  onOpenChange
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: agentId 
        ? `Hello! I'm Agent #${agentId}. How can I assist with your steel operations today?`
        : `Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel ${moduleContext || 'operations'} today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(propIsOpen || false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sync with external open state if provided
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsDrawerOpen(propIsOpen);
    }
  }, [propIsOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    websocketService.connect();

    // Subscribe to chat messages
    const unsubscribeChatMessages = websocketService.onMessage('chat', (payload: any) => {
      if (!payload.isUser) {
        setMessages(prev => [...prev, {
          text: payload.text,
          isUser: false,
          timestamp: new Date(payload.timestamp)
        }]);
        setIsLoading(false);
      }
    });

    // Subscribe to connection events
    const unsubscribeConnect = websocketService.onConnect(() => {
      toast({
        title: "Connected to AI Co-Pilot",
        description: "Real-time AI assistance is now available.",
      });
    });

    // Cleanup subscriptions when component unmounts
    return () => {
      unsubscribeChatMessages();
      unsubscribeConnect();
      // Don't disconnect WebSocket here as other components might be using it
    };
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
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

    // Auto-expand to fullscreen when user starts conversation
    if (messages.length <= 1 && !isFullscreen) {
      setIsFullscreen(true);
    }

    // Send message via WebSocket
    websocketService.sendMessage('chat', { 
      text: inputText,
      moduleContext,
      agentId,
      timestamp: new Date().toISOString(),
      isUser: true
    });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const navigateToChat = () => {
    if (agentId) {
      navigate(`/agent/${agentId}`);
    } else if (moduleContext) {
      navigate(`/chat/${moduleContext}`);
    } else {
      navigate('/chat');
    }
  };

  const renderContent = () => (
    <div className={`ey-card ${floating ? 'fixed bottom-4 right-4 z-50 shadow-xl w-96' : 'w-full'} 
                    ${isExpanded ? 'h-[80vh] w-[500px]' : 'h-[500px]'}
                    ${isFullscreen ? 'fixed inset-0 w-full h-full rounded-none z-50' : ''}
                    flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between mb-4 p-4 border-b border-gray-100">
        <div className="flex items-center">
          <BrainCircuit className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-xl font-bold text-ey-darkGray">
            {agentId ? `Agent #${agentId}` : 'EY SECP'}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <motion.span 
            className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full flex items-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI Assistant
          </motion.span>
          <button onClick={toggleFullscreen} className="text-ey-lightGray hover:text-ey-darkGray transition-colors">
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          {!isFullscreen && (
            <button onClick={navigateToChat} className="text-blue-500 hover:text-blue-700 transition-colors text-xs">
              Open Full View
            </button>
          )}
          {(floating || isFullscreen) && (
            <button onClick={() => {
              if (isFullscreen) {
                setIsFullscreen(false);
              } else {
                handleOpenChange(false);
              }
            }} className="text-ey-lightGray hover:text-ey-darkGray transition-colors">
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-gray-50/50">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`flex items-start max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`rounded-full p-2 ${message.isUser ? 'bg-indigo-500 text-white ml-2' : 'bg-ey-darkGray text-white mr-2'}`}>
                {message.isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div 
                className={`rounded-lg p-3 ${
                  message.isUser 
                    ? 'bg-indigo-100 text-ey-darkGray' 
                    : 'bg-ey-darkGray/10 text-ey-darkGray'
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                <p className="text-xs text-ey-lightGray mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
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
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-r-lg px-4 py-2 flex items-center justify-center hover:bg-indigo-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
          </button>
        </div>
      </form>
    </div>
  );

  if (floating) {
    return (
      <>
        <Drawer open={isDrawerOpen || isFullscreen} onOpenChange={handleOpenChange}>
          <DrawerTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg border-0"
              onClick={() => handleOpenChange(true)}
            >
              <BrainCircuit className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className={`p-0 max-h-[90vh] ${isFullscreen ? 'h-screen w-screen max-w-full' : ''}`}>
            {renderContent()}
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return isFullscreen ? (
    <div className="fixed inset-0 z-50 bg-white">
      {renderContent()}
    </div>
  ) : (
    renderContent()
  );
};

export default AiChatInterface;
