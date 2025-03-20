
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
    <div className="mb-1">
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={toggleDropdown}
                className={`w-full p-3 rounded-md flex items-center justify-center transition-colors ${
                  isActive ? 'bg-purple-500/20 text-purple-500' : 'text-gray-500 hover:bg-gray-500/10'
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
            isActive ? 'bg-purple-500/20 text-purple-500' : 'text-gray-500 hover:bg-gray-500/10'
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
          className="overflow-hidden ml-2 pl-5 border-l border-gray-200/20"
        >
          {isOpen && children}
        </motion.div>
      )}
    </div>
  );
};

export default SidebarDropdown;
