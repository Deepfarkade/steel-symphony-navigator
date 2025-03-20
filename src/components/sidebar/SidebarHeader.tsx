
import React from 'react';
import { ChevronLeft, ChevronRight, BrainCircuit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed, toggleSidebar }) => {
  return (
    <div className="p-4 flex items-center justify-between border-b border-gray-200/20">
      {!isCollapsed && (
        <Link to="/" className="flex items-center">
          <BrainCircuit className="h-6 w-6 text-purple-500" />
          <span className="ml-2 font-bold text-white/90">EY Steel AI</span>
        </Link>
      )}
      
      {isCollapsed && (
        <div className="w-full flex justify-center">
          <BrainCircuit className="h-6 w-6 text-purple-500" />
        </div>
      )}
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className="p-1 rounded-md bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </motion.button>
    </div>
  );
};

export default SidebarHeader;
