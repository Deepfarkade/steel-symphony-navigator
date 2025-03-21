
import React from 'react';
import { 
  ChartBar, 
  BarChart3, 
  PieChart, 
  AlertTriangle, 
  BrainCircuit, 
  FileWarning,
  LockKeyhole 
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SidebarDropdown from '../sidebar/SidebarDropdown';
import SidebarItem from '../sidebar/SidebarItem';
import { getIconComponent } from '@/utils/iconUtils';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const SupplyChainDropdown: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { hasModuleAccess } = useAuth();
  
  const isActive = location.pathname.includes('/demand-planning') || 
                   location.pathname.includes('/supply-planning') || 
                   location.pathname.includes('/order-promising') || 
                   location.pathname.includes('/factory-planning') || 
                   location.pathname.includes('/inventory-optimization') || 
                   location.pathname.includes('/inventory-liquidation') || 
                   location.pathname.includes('/logistics');
  
  // Helper function to create module items with access indicators
  const renderModuleItem = (title: string, moduleId: string, icon: React.ReactNode) => {
    const hasAccess = hasModuleAccess(moduleId);
    
    const moduleContent = (
      <SidebarItem
        title={title}
        icon={icon}
        to={`/${moduleId}`}
        isCollapsed={isCollapsed}
        theme={theme}
      />
    );
    
    if (!hasAccess && !isCollapsed) {
      return (
        <div className="relative">
          {moduleContent}
          <div className="absolute top-2 right-2 bg-amber-600 text-white px-1.5 py-0.5 rounded-md text-xs flex items-center">
            <LockKeyhole className="h-2.5 w-2.5 mr-0.5" />
            <span className="text-[10px]">Restricted</span>
          </div>
        </div>
      );
    }
    
    if (!hasAccess && isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                {moduleContent}
                <div className="absolute top-1 right-1 h-2 w-2 bg-amber-600 rounded-full"></div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="flex items-center">
                <LockKeyhole className="h-3 w-3 mr-1 text-amber-600" />
                <span className="text-xs">Restricted Access</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return moduleContent;
  };
  
  // Only show dropdown if user has access to at least one module or is an admin
  const hasAnyModuleAccess = 
    hasModuleAccess('demand-planning') ||
    hasModuleAccess('supply-planning') ||
    hasModuleAccess('order-promising') ||
    hasModuleAccess('factory-planning') ||
    hasModuleAccess('inventory-optimization') ||
    hasModuleAccess('inventory-liquidation') ||
    hasModuleAccess('logistics');
  
  if (!hasAnyModuleAccess) return null;
  
  return (
    <SidebarDropdown 
      title="Supply Chain Modules" 
      icon={<ChartBar className="h-5 w-5 text-green-500" />} 
      isCollapsed={isCollapsed}
      isActive={isActive}
      theme={theme}
    >
      <div className="py-2 space-y-1">
        {renderModuleItem(
          "Demand Planning",
          "demand-planning",
          <BarChart3 className="h-5 w-5 text-green-500" />
        )}
        
        {renderModuleItem(
          "Supply Planning",
          "supply-planning",
          getIconComponent('truck', "h-5 w-5 text-green-500")
        )}
        
        {renderModuleItem(
          "Order Promising",
          "order-promising",
          getIconComponent('package-check', "h-5 w-5 text-green-500")
        )}
        
        {renderModuleItem(
          "Factory Planning",
          "factory-planning",
          getIconComponent('factory', "h-5 w-5 text-green-500")
        )}
        
        {renderModuleItem(
          "Inventory Optimization",
          "inventory-optimization",
          getIconComponent('gantt-chart', "h-5 w-5 text-green-500")
        )}
        
        {renderModuleItem(
          "Inventory Liquidation",
          "inventory-liquidation",
          getIconComponent('dollar', "h-5 w-5 text-green-500")
        )}
        
        {renderModuleItem(
          "Logistics Management",
          "logistics",
          getIconComponent('network', "h-5 w-5 text-green-500")
        )}
      </div>
    </SidebarDropdown>
  );
};

export const RiskAnalyticsDropdown: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { hasModuleAccess } = useAuth();
  
  const isActive = location.pathname.includes('/risk-management') || 
                  location.pathname.includes('/analytics');
  
  // Helper function to create module items with access indicators
  const renderModuleItem = (title: string, moduleId: string, icon: React.ReactNode) => {
    const hasAccess = hasModuleAccess(moduleId);
    
    const moduleContent = (
      <SidebarItem
        title={title}
        icon={icon}
        to={`/${moduleId}`}
        isCollapsed={isCollapsed}
        theme={theme}
      />
    );
    
    if (!hasAccess && !isCollapsed) {
      return (
        <div className="relative">
          {moduleContent}
          <div className="absolute top-2 right-2 bg-amber-600 text-white px-1.5 py-0.5 rounded-md text-xs flex items-center">
            <LockKeyhole className="h-2.5 w-2.5 mr-0.5" />
            <span className="text-[10px]">Restricted</span>
          </div>
        </div>
      );
    }
    
    if (!hasAccess && isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                {moduleContent}
                <div className="absolute top-1 right-1 h-2 w-2 bg-amber-600 rounded-full"></div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="flex items-center">
                <LockKeyhole className="h-3 w-3 mr-1 text-amber-600" />
                <span className="text-xs">Restricted Access</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return moduleContent;
  };
  
  // Only show dropdown if user has access to at least one module
  const hasAnyModuleAccess = 
    hasModuleAccess('risk-management') ||
    hasModuleAccess('analytics');
  
  if (!hasAnyModuleAccess) return null;
  
  return (
    <SidebarDropdown 
      title="Risk & Analytics" 
      icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} 
      isCollapsed={isCollapsed}
      isActive={isActive}
      theme={theme}
    >
      <div className="py-2 space-y-1">
        {renderModuleItem(
          "Risk Management", 
          "risk-management",
          <FileWarning className="h-5 w-5 text-amber-500" />
        )}
        
        {renderModuleItem(
          "Analytics",
          "analytics",
          <PieChart className="h-5 w-5 text-amber-500" />
        )}
      </div>
    </SidebarDropdown>
  );
};
