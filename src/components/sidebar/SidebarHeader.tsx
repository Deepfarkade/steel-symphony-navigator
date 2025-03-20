
import React from 'react';
import { ChevronLeft, ChevronRight, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useTheme } from '@/context/ThemeContext';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed, toggleSidebar }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`p-4 flex items-center justify-between border-b ${isDark ? 'border-gray-700/20' : 'border-gray-200/20'}`}>
      {!isCollapsed && (
        <Link to="/" className="flex items-center">
          <BrainCircuit className="h-6 w-6 text-ey-yellow" />
          <span className={`ml-2 font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>EY SECP</span>
        </Link>
      )}
      
      {isCollapsed && (
        <div className="w-full flex justify-center">
          <BrainCircuit className="h-6 w-6 text-ey-yellow" />
        </div>
      )}
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className={`p-1 rounded-md ${
          isDark 
            ? 'bg-gray-700/50 text-gray-300 hover:text-white' 
            : 'bg-gray-200/70 text-gray-600 hover:text-gray-900'
        } transition-colors`}
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
