
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
  theme?: 'light' | 'dark';
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  title, 
  icon, 
  to, 
  isCollapsed,
  badge,
  activeCheck,
  theme = 'dark'
}) => {
  const location = useLocation();
  // Use the custom activeCheck function if provided, otherwise use the default check
  const isActive = activeCheck ? activeCheck(location.pathname) : location.pathname === to;

  const getLinkStyles = () => {
    if (theme === 'light') {
      return isActive 
        ? 'bg-ey-yellow/80 text-gray-800 font-medium shadow-md' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800 hover:shadow-sm';
    } else {
      return isActive 
        ? 'bg-ey-yellow/20 text-ey-yellow' 
        : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200';
    }
  };

  const content = (
    <Link
      to={to}
      className={`w-full p-3 rounded-md flex items-center justify-between transition-all duration-200 ${getLinkStyles()}`}
      aria-label={title}
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
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className={theme === 'light' ? "bg-white text-gray-800 border border-gray-200 shadow-lg" : "bg-gray-800 text-white border-none"}>
            <div className="flex items-center">
              <p>{title}</p>
              {badge && <div className="ml-2">{badge}</div>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <div className="mb-1">{content}</div>;
};

export default SidebarItem;
