
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trash, AlertTriangle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

interface AgentItemProps {
  id: number;
  name: string;
  icon: React.ReactNode;
  to: string;
  isCollapsed: boolean;
  onDelete: (id: number) => void;
}

const AgentItem: React.FC<AgentItemProps> = ({ 
  id, 
  name, 
  icon, 
  to, 
  isCollapsed,
  onDelete 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show confirmation toast
    toast({
      title: "Delete Agent",
      description: (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-amber-500">
            <AlertTriangle className="h-4 w-4" />
            <span>Are you sure you want to delete {name}?</span>
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => onDelete(id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      duration: 10000,
    });
  };

  const content = (
    <Link
      to={to}
      className={`group w-full p-3 rounded-md flex items-center justify-between transition-colors ${
        isActive 
          ? 'bg-purple-500/20 text-purple-500' 
          : 'text-gray-500 hover:bg-gray-500/10 hover:text-gray-700'
      }`}
    >
      <div className="flex items-center">
        <span className={`${!isCollapsed ? 'mr-3' : ''}`}>{icon}</span>
        {!isCollapsed && <span className="font-medium">{name}</span>}
      </div>
      
      {!isCollapsed && (
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 rounded-full hover:bg-red-100 hover:text-red-500"
          aria-label={`Delete ${name}`}
        >
          <Trash className="h-4 w-4" />
        </button>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <div className="relative mb-1 group">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-800 text-white border-none">
              <div className="flex items-center justify-between w-full">
                <p>{name}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(e);
                  }}
                  className="ml-2 p-1 rounded-full hover:bg-red-500/20 transition-colors"
                >
                  <Trash className="h-3 w-3" />
                </button>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return <div className="mb-1">{content}</div>;
};

export default AgentItem;
