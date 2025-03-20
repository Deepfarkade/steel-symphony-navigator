
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SidebarDropdownProps {
  title: string;
  icon: React.ReactNode;
  isCollapsed: boolean;
  isActive?: boolean;
  children: React.ReactNode;
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ 
  title, 
  icon, 
  isCollapsed, 
  isActive = false,
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-2">
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={toggleDropdown}
                className={`w-full p-3 rounded-md flex items-center justify-center transition-colors ${
                  isActive ? 'bg-ey-yellow/20 text-ey-yellow' : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                }`}
              >
                {icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-800 text-white border-none">
              <p>{title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <button
          onClick={toggleDropdown}
          className={`w-full p-3 rounded-md flex items-center justify-between transition-colors ${
            isActive ? 'bg-ey-yellow/20 text-ey-yellow' : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center">
            <span className="mr-3">{icon}</span>
            <span className="font-medium">{title}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}

      {!isCollapsed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden ml-2 pl-5 border-l border-gray-600/20"
        >
          {isOpen && children}
        </motion.div>
      )}
    </div>
  );
};

export default SidebarDropdown;
