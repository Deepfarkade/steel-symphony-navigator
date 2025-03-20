
import React from 'react';
import { BrainCircuit, Maximize2, Minimize2, X, Sparkles, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatHeaderProps {
  agentId?: number;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  handleClose: () => void;
  navigateToChat: () => void;
  floating?: boolean;
  toggleSidebar?: () => void;
  showSidebar?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  agentId, 
  isFullscreen,
  toggleFullscreen,
  handleClose,
  navigateToChat,
  floating = false,
  toggleSidebar,
  showSidebar
}) => {
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
            {agentId ? 'Specialized AI Assistant' : 'Steel Ecosystem Co-Pilot'}
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
        
        <button 
          onClick={navigateToChat} 
          className="text-gray-500 hover:text-indigo-600 transition-colors"
          title="Open Full View"
        >
          <ExternalLink size={18} />
        </button>
        
        <button 
          onClick={toggleFullscreen} 
          className="text-gray-500 hover:text-indigo-600 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
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
