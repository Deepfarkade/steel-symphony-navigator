
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

// Mock data for components
const mockAiStats = {
  modelsAnalyzed: 42,
  dataPointsProcessed: 1250000,
  predictionsGenerated: 876
};

const mockKpiData = {
  productionYield: { value: "94.8%", change: 2.3 },
  energyConsumption: { value: "1,235 MWh", change: -5.7 },
  qualityRating: { value: "A+", change: 1.2 },
  onTimeDelivery: { value: "92.3%", change: -0.8 }
};

const mockProductionData = [
  { month: "Jan", actual: 80, target: 75, previous: 65 },
  { month: "Feb", actual: 85, target: 80, previous: 70 },
  { month: "Mar", actual: 90, target: 85, previous: 75 },
  { month: "Apr", actual: 88, target: 90, previous: 80 },
  { month: "May", actual: 92, target: 90, previous: 82 },
  { month: "Jun", actual: 95, target: 95, previous: 85 }
];

const mockEnergyData = [
  { month: "Jan", consumption: 1200, target: 1300, previous: 1350 },
  { month: "Feb", consumption: 1180, target: 1250, previous: 1300 },
  { month: "Mar", consumption: 1220, target: 1200, previous: 1280 },
  { month: "Apr", consumption: 1150, target: 1150, previous: 1260 },
  { month: "May", consumption: 1100, target: 1100, previous: 1220 },
  { month: "Jun", consumption: 1050, target: 1050, previous: 1200 }
];

const mockInsights = [
  {
    id: 1,
    title: "Production Efficiency",
    content: "Production efficiency increased by 3.2% this month, exceeding the target by 1.7%.",
    impact: "high",
    source: "Production Analytics"
  },
  {
    id: 2,
    title: "Energy Consumption",
    content: "Energy usage is 5.7% lower than last quarter, resulting in significant cost savings.",
    impact: "medium",
    source: "Energy Monitoring"
  },
  {
    id: 3,
    title: "Quality Improvement",
    content: "Quality rating improved to A+ due to recent process optimizations.",
    impact: "high",
    source: "Quality Control"
  }
];

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
          <WelcomeSection aiStats={mockAiStats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <KpiOverview kpiData={mockKpiData} />
            </div>
            <div className="lg:col-span-1">
              <AiInsights />
            </div>
          </div>
          
          <AiModules />
          
          <ChartsSection 
            productionData={mockProductionData}
            energyData={mockEnergyData}
            insights={mockInsights}
            loading={isLoading}
          />
          
          <AiAgentsSection />
          
          <LatestIndustryNews />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
