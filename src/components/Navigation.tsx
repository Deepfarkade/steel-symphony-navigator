
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

import SidebarHeader from './sidebar/SidebarHeader';
import SidebarFooter from './sidebar/SidebarFooter';
import HomeItem from './navigation/HomeItem';
import { SupplyChainDropdown, RiskAnalyticsDropdown } from './navigation/NavigationDropdowns';
import AgentsDropdown from './navigation/AgentsDropdown';

const Navigation: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Dispatch an event when sidebar state changes so other components can react
    document.dispatchEvent(new CustomEvent('sidebar-state-changed', { 
      detail: { isCollapsed } 
    }));
    
    // Add a data attribute to the body element for easier CSS targeting
    document.body.setAttribute('data-sidebar-collapsed', isCollapsed.toString());
  }, [isCollapsed]);
  
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
          ? 'bg-white border-r border-gray-200 shadow-lg text-gray-800' 
          : 'bg-gradient-to-b from-[#161B2E] to-[#2E2E38] text-white border-r border-gray-700/50'
      } flex flex-col`}
    >
      <SidebarHeader isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Home */}
        <HomeItem isCollapsed={isCollapsed} />
        
        {/* Supply Chain Modules Section */}
        <SupplyChainDropdown isCollapsed={isCollapsed} />
        
        {/* Risk & Analytics Section */}
        <RiskAnalyticsDropdown isCollapsed={isCollapsed} />
        
        {/* Agents Section */}
        <AgentsDropdown isCollapsed={isCollapsed} />
      </div>
      
      <SidebarFooter isCollapsed={isCollapsed} />
    </motion.aside>
  );
};

export default Navigation;
