
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import KpiOverview from '../components/dashboard/KpiOverview';
import AiInsights from '../components/AiInsights';
import AiModules from '../components/dashboard/AiModules';
import ChartsSection from '../components/dashboard/ChartsSection';
import AiAgentsSection from '../components/dashboard/AiAgentsSection';
import LatestIndustryNews from '../components/LatestIndustryNews';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    // Listen for sidebar state changes
    const handleSidebarChange = (event: CustomEvent) => {
      const { isCollapsed } = event.detail;
      setSidebarCollapsed(isCollapsed);
    };
    
    document.addEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    
    // Check if sidebar is already collapsed on mount
    const currentState = document.body.getAttribute('data-sidebar-collapsed');
    if (currentState === 'true') {
      setSidebarCollapsed(true);
    }
    
    return () => {
      document.removeEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ey-black/90">
      <Navigation />
      
      <motion.div 
        data-main-content 
        className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-64'} p-8`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header 
          pageTitle="EY Steel Ecosystem Control Panel"  
          breadcrumbs={[
            { label: 'Home', link: '/' }
          ]}
        />
        
        <div className="mt-6 space-y-8">
          <WelcomeSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <KpiOverview />
            </div>
            <div className="lg:col-span-1">
              <AiInsights />
            </div>
          </div>
          
          <AiModules />
          
          <ChartsSection />
          
          <AiAgentsSection />
          
          <LatestIndustryNews />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
