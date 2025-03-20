
import React from 'react';
import { 
  ChartBar, 
  BarChart3, 
  PieChart, 
  AlertTriangle, 
  BrainCircuit, 
  FileWarning 
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SidebarDropdown from '../sidebar/SidebarDropdown';
import SidebarItem from '../sidebar/SidebarItem';
import { getIconComponent } from '@/utils/iconUtils';
import { useTheme } from '@/context/ThemeContext';

export const SupplyChainDropdown: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const location = useLocation();
  const { theme } = useTheme();
  
  const isActive = location.pathname.includes('/demand-planning') || 
                   location.pathname.includes('/supply-planning') || 
                   location.pathname.includes('/order-promising') || 
                   location.pathname.includes('/factory-planning') || 
                   location.pathname.includes('/inventory-optimization') || 
                   location.pathname.includes('/inventory-liquidation') || 
                   location.pathname.includes('/logistics');
  
  return (
    <SidebarDropdown 
      title="Supply Chain Modules" 
      icon={<ChartBar className="h-5 w-5 text-green-500" />} 
      isCollapsed={isCollapsed}
      isActive={isActive}
      theme={theme}
    >
      <div className="py-2 space-y-1">
        <SidebarItem
          title="Demand Planning"
          icon={<BarChart3 className="h-5 w-5 text-green-500" />}
          to="/demand-planning"
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarItem
          title="Supply Planning"
          icon={getIconComponent('truck', "h-5 w-5 text-green-500")}
          to="/supply-planning"
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarItem
          title="Order Promising"
          icon={getIconComponent('package-check', "h-5 w-5 text-green-500")}
          to="/order-promising"
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarItem
          title="Factory Planning"
          icon={getIconComponent('factory', "h-5 w-5 text-green-500")}
          to="/factory-planning"
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarItem
          title="Inventory Optimization"
          icon={getIconComponent('gantt-chart', "h-5 w-5 text-green-500")}
          to="/inventory-optimization"
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarItem
          title="Inventory Liquidation"
          icon={getIconComponent('dollar', "h-5 w-5 text-green-500")}
          to="/inventory-liquidation"
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarItem
          title="Logistics Management"
          icon={getIconComponent('network', "h-5 w-5 text-green-500")}
          to="/logistics"
          isCollapsed={isCollapsed}
          theme={theme}
        />
      </div>
    </SidebarDropdown>
  );
};

export const RiskAnalyticsDropdown: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const location = useLocation();
  const { theme } = useTheme();
  
  const isActive = location.pathname.includes('/risk-management') || 
                  location.pathname.includes('/analytics');
  
  return (
    <SidebarDropdown 
      title="Risk & Analytics" 
      icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} 
      isCollapsed={isCollapsed}
      isActive={isActive}
      theme={theme}
    >
      <div className="py-2 space-y-1">
        <SidebarItem
          title="Risk Management"
          icon={<FileWarning className="h-5 w-5 text-amber-500" />}
          to="/risk-management"
          isCollapsed={isCollapsed}
          theme={theme}
        />
        <SidebarItem
          title="Analytics"
          icon={<PieChart className="h-5 w-5 text-amber-500" />}
          to="/analytics"
          isCollapsed={isCollapsed}
          theme={theme}
        />
      </div>
    </SidebarDropdown>
  );
};
