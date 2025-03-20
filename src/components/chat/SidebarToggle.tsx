
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SidebarToggleProps {
  showSidebar: boolean;
  toggleSidebar: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({
  showSidebar,
  toggleSidebar
}) => {
  return (
    <div className={`absolute top-1/2 -translate-y-1/2 ${showSidebar ? 'left-64' : 'left-0'} z-20 transition-all duration-300`}>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-6 w-6 rounded-full border border-gray-200 bg-white shadow-md"
        onClick={toggleSidebar}
      >
        {showSidebar ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </Button>
    </div>
  );
};

export default SidebarToggle;
