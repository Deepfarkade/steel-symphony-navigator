
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SidebarItemProps {
  title: string;
  icon: React.ReactNode;
  to: string;
  isCollapsed: boolean;
  badge?: React.ReactNode;
  activeCheck?: (path: string) => boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  title, 
  icon, 
  to, 
  isCollapsed,
  badge,
  activeCheck 
}) => {
  const location = useLocation();
  // Use the custom activeCheck function if provided, otherwise use the default check
  const isActive = activeCheck ? activeCheck(location.pathname) : location.pathname === to;

  const content = (
    <Link
      to={to}
      className={`w-full p-3 rounded-md flex items-center justify-between transition-colors ${
        isActive 
          ? 'bg-ey-yellow/20 text-ey-yellow' 
          : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
      }`}
    >
      <div className="flex items-center">
        <span className={`${!isCollapsed ? 'mr-3' : ''}`}>{icon}</span>
        {!isCollapsed && <span className="font-medium">{title}</span>}
      </div>
      {!isCollapsed && badge}
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 text-white border-none">
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <div className="mb-1">{content}</div>;
};

export default SidebarItem;
