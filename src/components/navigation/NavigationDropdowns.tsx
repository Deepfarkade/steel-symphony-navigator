
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
import { useAuth } from '@/context/AuthContext';

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
  
  // Only show dropdown if user has access to at least one module
  const hasAnyModuleAccess = 
    hasModuleAccess('demand-planning') ||
    hasModuleAccess('supply-planning') ||
    hasModuleAccess('order-promising') ||
    hasModuleAccess('factory-planning') ||
    hasModuleAccess('inventory-optimization') ||
    hasModuleAccess('inventory-liquidation') ||
    hasModuleAccess('logistics');
  
  if (!hasAnyModuleAccess) return null;
  
  const supplyChainModules = [
    {
      id: 'demand-planning',
      title: 'Demand Planning',
      icon: <BarChart3 className="h-5 w-5 text-green-500" />,
      path: '/demand-planning'
    },
    {
      id: 'supply-planning',
      title: 'Supply Planning',
      icon: getIconComponent('truck', "h-5 w-5 text-green-500"),
      path: '/supply-planning'
    },
    {
      id: 'order-promising',
      title: 'Order Promising',
      icon: getIconComponent('package-check', "h-5 w-5 text-green-500"),
      path: '/order-promising'
    },
    {
      id: 'factory-planning',
      title: 'Factory Planning',
      icon: getIconComponent('factory', "h-5 w-5 text-green-500"),
      path: '/factory-planning'
    },
    {
      id: 'inventory-optimization',
      title: 'Inventory Optimization',
      icon: getIconComponent('gantt-chart', "h-5 w-5 text-green-500"),
      path: '/inventory-optimization'
    },
    {
      id: 'inventory-liquidation',
      title: 'Inventory Liquidation',
      icon: getIconComponent('dollar', "h-5 w-5 text-green-500"),
      path: '/inventory-liquidation'
    },
    {
      id: 'logistics',
      title: 'Logistics Management',
      icon: getIconComponent('network', "h-5 w-5 text-green-500"),
      path: '/logistics'
    }
  ];
  
  return (
    <SidebarDropdown 
      title="Supply Chain Modules" 
      icon={<ChartBar className="h-5 w-5 text-green-500" />} 
      isCollapsed={isCollapsed}
      isActive={isActive}
      theme={theme}
    >
      <div className="py-2 space-y-1">
        {supplyChainModules.map(module => {
          // Only render the module item if user has access
          const userHasAccess = hasModuleAccess(module.id);
          
          if (!userHasAccess) return null;
          
          return (
            <SidebarItem
              key={module.id}
              title={module.title}
              icon={module.icon}
              to={module.path}
              isCollapsed={isCollapsed}
              theme={theme}
            />
          );
        })}
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
        {hasModuleAccess('risk-management') && (
          <SidebarItem
            title="Risk Management"
            icon={<FileWarning className="h-5 w-5 text-amber-500" />}
            to="/risk-management"
            isCollapsed={isCollapsed}
            theme={theme}
          />
        )}
        
        {hasModuleAccess('analytics') && (
          <SidebarItem
            title="Analytics"
            icon={<PieChart className="h-5 w-5 text-amber-500" />}
            to="/analytics"
            isCollapsed={isCollapsed}
            theme={theme}
          />
        )}
      </div>
    </SidebarDropdown>
  );
};
