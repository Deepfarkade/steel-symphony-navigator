
import React, { useEffect } from 'react';
import { BrainCircuit, Maximize2, Minimize2, X, Sparkles, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ChatHeaderProps {
  agentId?: number;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  handleClose: () => void;
  navigateToChat: () => void;
  floating?: boolean;
  toggleSidebar?: () => void;
  showSidebar?: boolean;
  messageCount?: number;
  moduleContext?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  agentId, 
  isFullscreen,
  toggleFullscreen,
  handleClose,
  navigateToChat,
  floating = false,
  toggleSidebar,
  showSidebar,
  messageCount = 0,
  moduleContext
}) => {
  const { hasModuleAccess } = useAuth();
  const { toast } = useToast();

  const handleFullscreenClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Fullscreen button clicked, current state:", isFullscreen);
    toggleFullscreen();
  };

  const handleNavigateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Normalize moduleContext and check access
    const normalizedModuleContext = moduleContext?.toLowerCase().replace(/\s+/g, '-');
    
    // Check module access before navigating
    if (normalizedModuleContext && !hasModuleAccess(normalizedModuleContext)) {
      toast({
        title: "Access Denied",
        description: `You don't have access to the ${normalizedModuleContext.replace(/-/g, ' ')} module.`,
        variant: "destructive"
      });
      return;
    }
    
    // If we have access, proceed with navigation
    navigateToChat();
  };

  // Auto navigate to full view when user has sent messages
  useEffect(() => {
    if (messageCount > 0 && floating && !isFullscreen) {
      // Highlight the external link button to encourage clicking
      console.log("Message count increased, should navigate to chat:", messageCount);
    }
  }, [messageCount, floating, isFullscreen, navigateToChat]);

  // Format a displayable module name from the context
  const formatModuleName = (context?: string) => {
    if (!context) return '';
    return context
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
          <BrainCircuit className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-base font-medium text-ey-darkGray">
            {agentId ? `Agent #${agentId}` : 'EY SECP'}
          </h2>
          <p className="text-xs text-gray-500">
            {moduleContext ? `${formatModuleName(moduleContext)} Assistant` : 'Steel Ecosystem Co-Pilot'}
          </p>
        </div>
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
        
        {(!isFullscreen || floating) && (
          <motion.button 
            onClick={handleNavigateClick} 
            className={`text-gray-500 hover:text-indigo-600 transition-colors ${messageCount > 0 && floating ? 'animate-pulse text-indigo-600' : ''}`}
            title="Open Full View"
            animate={messageCount > 0 && floating && !isFullscreen ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: messageCount > 0 && floating && !isFullscreen ? Infinity : 0 }}
          >
            <ExternalLink size={18} />
          </motion.button>
        )}
        
        <button 
          onClick={handleFullscreenClick} 
          className="text-gray-500 hover:text-indigo-600 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        
        {(floating || isFullscreen) && (
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
