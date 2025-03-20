
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Box, 
  ClipboardList, 
  Database, 
  Factory, 
  Package, 
  Orbit, 
  Truck, 
  AlertTriangle,
  BarChart2,
  LineChart,
  Zap,
  Timer,
  BrainCircuit,
  Sparkles,
  Bot,
  Brain,
  ChevronRight,
  ArrowRight,
  BrainCog,
  Lightbulb,
  Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import Navigation from '../components/Navigation';
import Header from '../components/Header';
import KpiCard from '../components/KpiCard';
import AreaChart from '../components/AreaChart';
import AiInsights from '../components/AiInsights';
import ModuleCard from '../components/ModuleCard';
import AiPulse from '../components/AiPulse';
import FuturisticWelcome from '../components/FuturisticWelcome';
import AiIntroduction from '../components/AiIntroduction';
import AiChatInterface from '../components/AiChatInterface';
import AiAgentsDeployment from '../components/AiAgentsDeployment';
import AiAgentCard from '../components/AiAgentCard';
import LatestIndustryNews from '../components/LatestIndustryNews';
import { 
  getProductionData, 
  getEnergyConsumptionData, 
  getKpiData, 
  getAiInsights, 
  getCoPilotAnalytics 
} from '@/services/dataService';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const pulseVariant = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  }
};

const floatVariant = {
  initial: { y: 0 },
  float: {
    y: [0, -5, 0, 5, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  }
};

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any>({});
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiAgentActive, setAiAgentActive] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

    // Add event listener for sidebar state change
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
  
  const handleAskCoPilot = () => {
    navigate('/chat');
    
    toast({
      title: "Co-Pilot Activated",
      description: "Your EY Steel Ecosystem Co-Pilot is ready to assist you.",
    });
  };
  
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
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-xl p-4 mb-8 text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-grid-white/5 opacity-20" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                variants={pulseVariant}
                initial="initial"
                animate="pulse"
                className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center"
              >
                <BrainCog className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">EY Steel Ecosystem Co-Pilot</h2>
                <div className="flex items-center mt-1">
                  <span className="text-white/80 text-sm">AI Agent Status:</span>
                  <div className="flex items-center ml-2">
                    <span className="h-2.5 w-2.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                    <span className="text-green-300 font-medium text-sm">Active & Learning</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <div>
                <p className="text-white/70 text-sm">Models Analyzed</p>
                <p className="text-xl font-bold">{aiStats.modelsAnalyzed}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Data Points Processed</p>
                <p className="text-xl font-bold">{aiStats.dataPointsProcessed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Predictions Generated</p>
                <p className="text-xl font-bold">{aiStats.predictionsGenerated}</p>
              </div>
            </div>
            
            <div>
              <Button 
                className="bg-white hover:bg-white/90 text-purple-700 border-none shadow-lg" 
                onClick={handleAskCoPilot}
              >
                <Brain className="h-4 w-4 mr-2" />
                <span>Ask Co-Pilot</span>
              </Button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-ey-darkGray">Today's Overview</h2>
            <div className="ml-2 px-2 py-1 bg-purple-100 rounded-md text-xs font-medium text-purple-700 flex items-center">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div custom={0} variants={fadeIn}>
              <Link to="/kpi/production-yield">
                <KpiCard 
                  title="Production Yield" 
                  value={kpiData.productionYield?.value || "94.8%"} 
                  change={Number(kpiData.productionYield?.change || 2.3)} 
                  icon={<BarChart2 className="h-6 w-6 text-ey-darkGray" />} 
                />
              </Link>
            </motion.div>
            <motion.div custom={1} variants={fadeIn}>
              <Link to="/kpi/energy-consumption">
                <KpiCard 
                  title="Energy Consumption" 
                  value={kpiData.energyConsumption?.value || "1,235 MWh"} 
                  change={Number(kpiData.energyConsumption?.change || -5.7)} 
                  icon={<Zap className="h-6 w-6 text-ey-darkGray" />}
                  color="bg-blue-100" 
                />
              </Link>
            </motion.div>
            <motion.div custom={2} variants={fadeIn}>
              <Link to="/kpi/quality-rating">
                <KpiCard 
                  title="Quality Rating" 
                  value={kpiData.qualityRating?.value || "A+"} 
                  change={Number(kpiData.qualityRating?.change || 1.2)} 
                  icon={<LineChart className="h-6 w-6 text-ey-darkGray" />}
                  color="bg-green-100" 
                />
              </Link>
            </motion.div>
            <motion.div custom={3} variants={fadeIn}>
              <Link to="/kpi/on-time-delivery">
                <KpiCard 
                  title="On-Time Delivery" 
                  value={kpiData.onTimeDelivery?.value || "92.3%"} 
                  change={Number(kpiData.onTimeDelivery?.change || -0.8)} 
                  icon={<Timer className="h-6 w-6 text-ey-darkGray" />}
                  color="bg-purple-100" 
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        <LatestIndustryNews />
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  Steel Production (tons)
                  <motion.div
                    className="ml-2 h-2 w-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </CardTitle>
                <CardDescription>
                  Real-time production data
                  <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-500 border-purple-200">
                    AI Analysis
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart 
                  data={productionData} 
                  color="#7E69AB"
                  title="Steel Production"
                />
              </CardContent>
              <CardFooter className="pt-0">
                <Link to="/charts/production">
                  <Button variant="ghost" className="text-purple-600 flex items-center">
                    <span>View detailed report</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>

                <Link to="/analytics" className="ml-auto">
                  <Button variant="outline" size="sm" className="text-purple-500 border-purple-200 hover:bg-purple-50">
                    Advanced Analytics
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <div className="col-span-1">
            <AiInsights insights={insights} loading={loading} />
          </div>
        </motion.div>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold flex items-center">
                Energy Consumption (MWh)
                <motion.div
                  className="ml-2 h-2 w-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </CardTitle>
              <CardDescription>
                Monitoring energy efficiency
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-500 border-blue-200">
                  AI Optimized
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart 
                data={energyData} 
                color="#9b87f5"
                title="Energy Usage"
              />
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/charts/energy">
                <Button variant="ghost" className="text-purple-600 flex items-center">
                  <span>View efficiency recommendations</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div 
          className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-grid-white/5 opacity-20" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Steel Ecosystem AI Agents</h3>
                  <p className="text-white/80 max-w-xl">Our specialized AI agents continuously analyze your steel operations, providing tailored recommendations and predictive insights.</p>
                </div>
              </div>
              <AiAgentsDeployment />
            </div>
            
            <AnimatePresence>
              {aiAgentActive && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {['Agentic RCA', 'Smart RCA Generator', 'PlanXpert', 'QualityGuard', 'RiskRadar'].map((agent, i) => (
                      <AiAgentCard
                        key={i}
                        id={i+1}
                        name={agent}
                        description=""
                        status="active"
                        confidence={85 + Math.floor(Math.random() * 10)}
                        icon={['brain-circuit', 'bar-chart', 'zap', 'check-circle', 'shield'][i]}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-ey-darkGray mb-6 flex items-center">
            <BrainCircuit className="h-6 w-6 text-purple-500 mr-2" />
            <span className="relative">
              AI-Powered Modules
              <span className="absolute -top-1 -right-8">
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
              </span>
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div custom={0} variants={fadeIn}>
              <ModuleCard 
                title="Demand Planning" 
                description="AI-powered steel demand forecasting with multiple prediction models" 
                icon={<BarChart3 className="h-6 w-6 text-ey-darkGray" />} 
                path="/demand-planning" 
                completed="85"
              />
            </motion.div>
            <motion.div custom={1} variants={fadeIn}>
              <ModuleCard 
                title="Enterprise Supply Planning" 
                description="End-to-end steel supply network visualization and optimization" 
                icon={<Orbit className="h-6 w-6 text-ey-darkGray" />} 
                path="/supply-planning"
                color="bg-blue-100" 
                completed="92"
              />
            </motion.div>
            <motion.div custom={2} variants={fadeIn}>
              <ModuleCard 
                title="Order Promising" 
                description="Dynamic ATP calculations for steel products and delivery prediction" 
                icon={<ClipboardList className="h-6 w-6 text-ey-darkGray" />} 
                path="/order-promising"
                color="bg-green-100" 
                completed="78"
              />
            </motion.div>
            <motion.div custom={3} variants={fadeIn}>
              <ModuleCard 
                title="Factory Planning" 
                description="Steel production scheduling optimization and resource allocation" 
                icon={<Factory className="h-6 w-6 text-ey-darkGray" />} 
                path="/factory-planning"
                color="bg-purple-100" 
                completed="64"
              />
            </motion.div>
            <motion.div custom={4} variants={fadeIn}>
              <ModuleCard 
                title="Inventory Optimization" 
                description="Multi-echelon inventory optimization for raw materials and finished steel products" 
                icon={<Package className="h-6 w-6 text-ey-darkGray" />} 
                path="/inventory-optimization"
                color="bg-orange-100" 
                completed="73"
              />
            </motion.div>
            <motion.div custom={5} variants={fadeIn}>
              <ModuleCard 
                title="Inventory Liquidation" 
                description="AI-powered pricing recommendations for liquidation of excess inventory" 
                icon={<Box className="h-6 w-6 text-ey-darkGray" />} 
                path="/inventory-liquidation"
                color="bg-red-100" 
                completed="56"
              />
            </motion.div>
            <motion.div custom={6} variants={fadeIn}>
              <ModuleCard 
                title="Logistics Management" 
                description="Route optimization for heavy steel transport and carrier selection" 
                icon={<Truck className="h-6 w-6 text-ey-darkGray" />} 
                path="/logistics"
                color="bg-indigo-100" 
                completed="81"
              />
            </motion.div>
            <motion.div custom={7} variants={fadeIn}>
              <ModuleCard 
                title="Risk Management" 
                description="Steel supply chain risk identification and proactive mitigation recommendations" 
                icon={<AlertTriangle className="h-6 w-6 text-ey-darkGray" />} 
                path="/risk-management"
                color="bg-yellow-100" 
                completed="68"
              />
            </motion.div>
            <motion.div custom={8} variants={fadeIn}>
              <ModuleCard 
                title="Analytics & Reporting" 
                description="Customizable dashboards and AI-generated narrative insights" 
                icon={<Database className="h-6 w-6 text-ey-darkGray" />} 
                path="/analytics"
                color="bg-teal-100" 
                completed="90"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Disable the floating chatbot */}
      {/* <AiChatInterface floating isOpen={chatOpen} onOpenChange={setChatOpen} /> */}
    </div>
  );
};

export default Index;
