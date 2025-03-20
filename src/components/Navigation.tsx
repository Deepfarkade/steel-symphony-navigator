
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Home,
  ChartBar, 
  BarChart3,
  PieChart, 
  AlertTriangle, 
  BrainCircuit, 
  FileWarning
} from 'lucide-react';

import SidebarHeader from './sidebar/SidebarHeader';
import SidebarFooter from './sidebar/SidebarFooter';
import SidebarDropdown from './sidebar/SidebarDropdown';
import SidebarItem from './sidebar/SidebarItem';
import AgentItem from './sidebar/AgentItem';
import { useAgents } from '@/hooks/useAgents';
import { getIconComponent } from '@/utils/iconUtils';
import { useTheme } from '@/context/ThemeContext';

const Navigation: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { agents, loading, deleteAgent } = useAgents();
  const location = useLocation();
  const { theme } = useTheme();
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Animation variants
  const sidebarVariants = {
    expanded: { width: '256px' },
    collapsed: { width: '70px' }
  };

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-0 z-20 h-screen ${
        theme === 'light' 
          ? 'bg-white border-r border-gray-200 text-ey-darkGray' 
          : 'bg-gradient-to-b from-[#161B2E] to-[#2E2E38] text-white border-r border-gray-700/50'
      } flex flex-col shadow-xl`}
    >
      <SidebarHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Home */}
        <SidebarItem
          title="Home"
          icon={<Home className={`h-5 w-5 ${theme === 'light' ? 'text-ey-darkGray' : 'text-white'}`} />}
          to="/"
          isCollapsed={isCollapsed}
        />
        
        {/* Supply Chain Modules Section */}
        <SidebarDropdown 
          title="Supply Chain Modules" 
          icon={<ChartBar className="h-5 w-5 text-green-400" />} 
          isCollapsed={isCollapsed}
          isActive={location.pathname.includes('/demand-planning') || 
                   location.pathname.includes('/supply-planning') || 
                   location.pathname.includes('/order-promising') || 
                   location.pathname.includes('/factory-planning') || 
                   location.pathname.includes('/inventory-optimization') || 
                   location.pathname.includes('/inventory-liquidation') || 
                   location.pathname.includes('/logistics')}
        >
          <div className="py-2 space-y-1">
            <SidebarItem
              title="Demand Planning"
              icon={<BarChart3 className="h-5 w-5 text-green-400" />}
              to="/demand-planning"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              title="Supply Planning"
              icon={getIconComponent('truck', "h-5 w-5 text-green-400")}
              to="/supply-planning"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              title="Order Promising"
              icon={getIconComponent('package-check', "h-5 w-5 text-green-400")}
              to="/order-promising"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              title="Factory Planning"
              icon={getIconComponent('factory', "h-5 w-5 text-green-400")}
              to="/factory-planning"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              title="Inventory Optimization"
              icon={getIconComponent('gantt-chart', "h-5 w-5 text-green-400")}
              to="/inventory-optimization"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              title="Inventory Liquidation"
              icon={getIconComponent('dollar', "h-5 w-5 text-green-400")}
              to="/inventory-liquidation"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              title="Logistics Management"
              icon={getIconComponent('network', "h-5 w-5 text-green-400")}
              to="/logistics"
              isCollapsed={isCollapsed}
            />
          </div>
        </SidebarDropdown>
        
        {/* Risk & Analytics Section */}
        <SidebarDropdown 
          title="Risk & Analytics" 
          icon={<AlertTriangle className="h-5 w-5 text-amber-400" />} 
          isCollapsed={isCollapsed}
          isActive={location.pathname.includes('/risk-management') || 
                   location.pathname.includes('/analytics')}
        >
          <div className="py-2 space-y-1">
            <SidebarItem
              title="Risk Management"
              icon={<FileWarning className="h-5 w-5 text-amber-400" />}
              to="/risk-management"
              isCollapsed={isCollapsed}
            />
            <SidebarItem
              title="Analytics"
              icon={<PieChart className="h-5 w-5 text-amber-400" />}
              to="/analytics"
              isCollapsed={isCollapsed}
            />
          </div>
        </SidebarDropdown>
        
        {/* Agents Section */}
        <SidebarDropdown 
          title="Your Agents" 
          icon={<BrainCircuit className="h-5 w-5 text-ey-yellow" />} 
          isCollapsed={isCollapsed}
          isActive={location.pathname.includes('/agent/') || 
                   location.pathname.includes('/agents')}
        >
          <div className="py-2 space-y-1">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="w-full h-10 bg-gray-700/20 animate-pulse rounded-md mb-1"></div>
              ))
            ) : agents.length > 0 ? (
              agents.map(agent => (
                <AgentItem
                  key={agent.id}
                  id={agent.id}
                  name={agent.name}
                  icon={getIconComponent(agent.icon)}
                  to={`/agent/${agent.id}`}
                  isCollapsed={isCollapsed}
                  onDelete={deleteAgent}
                />
              ))
            ) : (
              <div className="text-sm text-gray-400 py-2 px-3">
                No agents deployed yet
              </div>
            )}
            
            <SidebarItem
              title="Add New Agent"
              icon={getIconComponent('plus', "h-5 w-5 text-ey-yellow")}
              to="/agents"
              isCollapsed={isCollapsed}
              badge={<span className="px-2 py-0.5 text-xs bg-ey-yellow/20 text-ey-yellow rounded-full">Marketplace</span>}
            />
            
            <SidebarItem
              title="All Agents"
              icon={getIconComponent('layout-grid', "h-5 w-5 text-ey-yellow")}
              to="/agents"
              isCollapsed={isCollapsed}
              activeCheck={(path) => path === "/agents"}
            />
          </div>
        </SidebarDropdown>
      </div>
      
      <SidebarFooter isCollapsed={isCollapsed} />
    </motion.aside>
  );
};

export default Navigation;
