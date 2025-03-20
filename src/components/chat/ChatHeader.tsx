
import React from 'react';
import { BrainCircuit, Maximize2, Minimize2, X, Sparkles } from 'lucide-react';
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
          <button onClick={handleClose} className="text-ey-lightGray hover:text-ey-darkGray transition-colors">
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
