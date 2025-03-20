
import React from 'react';
import { Settings, LogOut, BrainCircuit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed }) => {
  return (
    <div className="mt-auto p-4 border-t border-gray-200/20">
      {!isCollapsed ? (
        <div className="space-y-3">
          <Link to="/create-agent">
            <Button 
              variant="outline" 
              className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Agent
            </Button>
          </Link>
          
          <div className="flex justify-between">
            <Link 
              to="/user/preferences" 
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/30 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </Link>
            
            <Link 
              to="/login" 
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/30 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  to="/create-agent"
                  className="p-2 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-800 text-white border-none">
                <p>Add New Agent</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex flex-col space-y-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/user/preferences" 
                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/30 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-white border-none">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    to="/login" 
                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/30 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-white border-none">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarFooter;
