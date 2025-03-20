
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import AiChatInterface from '@/components/AiChatInterface';
import AiPulse from '@/components/AiPulse';
import FuturisticWelcome from '@/components/FuturisticWelcome';
import AiIntroduction from '@/components/AiIntroduction';
import { useAuth } from '@/context/AuthContext';
import { 
  getProductionData, 
  getEnergyConsumptionData, 
  getKpiData, 
  getAiInsights, 
  getCoPilotAnalytics 
} from '@/services/dataService';

// Import refactored components
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import KpiOverview from '@/components/dashboard/KpiOverview';
import ChartsSection from '@/components/dashboard/ChartsSection';
import AiAgentsSection from '@/components/dashboard/AiAgentsSection';
import AiModules from '@/components/dashboard/AiModules';
import LatestIndustryNews from '@/components/LatestIndustryNews';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any>({});
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const [aiStats, setAiStats] = useState({
    modelsAnalyzed: 0,
    dataPointsProcessed: 0,
    predictionsGenerated: 0
  });

  const getUserDisplayName = () => {
    if (!user) return 'User';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.email.split('@')[0];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const handleSidebarChange = (event: CustomEvent) => {
      const { isCollapsed } = event.detail;
      setSidebarCollapsed(isCollapsed);
    };

    document.addEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    
    return () => {
      document.removeEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    };
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [production, energy, kpis, aiInsightsData, coAnalytics] = await Promise.all([
          getProductionData(),
          getEnergyConsumptionData(),
          getKpiData(),
          getAiInsights(),
          getCoPilotAnalytics()
        ]);
        
        setProductionData(production);
        setEnergyData(energy);
        setKpiData(kpis);
        setInsights(aiInsightsData);
        setAiStats(coAnalytics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (!showWelcome) {
      fetchData();
    }
  }, [showWelcome]);
  
  if (showWelcome) {
    return <FuturisticWelcome />;
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      <div 
        data-main-content 
        className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-64'} p-8 relative`}
      > 
        <AiPulse />
        <Header pageTitle={`Welcome, ${getUserDisplayName()}!`} showCoPilotButton={false} />
        
        <AiIntroduction />
        
        <WelcomeSection aiStats={aiStats} />
        
        <KpiOverview kpiData={kpiData} />
        
        <LatestIndustryNews />
        
        <ChartsSection 
          productionData={productionData}
          energyData={energyData}
          insights={insights}
          loading={loading}
        />
        
        <AiAgentsSection />
        
        <AiModules />
      </div>
      
      <AiChatInterface floating isOpen={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
};

export default Index;
