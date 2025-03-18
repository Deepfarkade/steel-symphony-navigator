
import React, { useState, useEffect, useRef } from 'react';
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
  Star,
  GitBranch,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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
import { getProductionData, getEnergyConsumptionData, getKpiData, getAiInsights } from '@/services/dataService';
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Animation variants
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

const agentIcons = [
  <Brain className="h-5 w-5 text-purple-500" />,
  <BrainCircuit className="h-5 w-5 text-blue-500" />,
  <GitBranch className="h-5 w-5 text-green-500" />,
  <Lightbulb className="h-5 w-5 text-yellow-500" />,
  <Star className="h-5 w-5 text-orange-500" />
];

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any>({});
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [activePredictionModel, setActivePredictionModel] = useState(0);
  const [aiAgentActive, setAiAgentActive] = useState(false);
  const { user } = useAuth();

  // Animated counter for AI processing stats
  const [aiStats, setAiStats] = useState({
    modelsAnalyzed: 0,
    dataPointsProcessed: 0,
    predictionsGenerated: 0
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [production, energy, kpis, aiInsights] = await Promise.all([
          getProductionData(),
          getEnergyConsumptionData(),
          getKpiData(),
          getAiInsights()
        ]);
        
        setProductionData(production);
        setEnergyData(energy);
        setKpiData(kpis);
        setInsights(aiInsights);
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

  // Animated counter effect for AI stats
  useEffect(() => {
    if (!showWelcome && !loading) {
      const interval = setInterval(() => {
        setAiStats(prev => ({
          modelsAnalyzed: Math.min(prev.modelsAnalyzed + 1, 12),
          dataPointsProcessed: Math.min(prev.dataPointsProcessed + 1000, 15000),
          predictionsGenerated: Math.min(prev.predictionsGenerated + 5, 87)
        }));
      }, 50);

      return () => clearInterval(interval);
    }
  }, [showWelcome, loading]);

  // Cycle through prediction models
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePredictionModel(prev => (prev + 1) % 5);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const predictionModels = [
    { name: "Neural Network", confidence: "97.2%", icon: <BrainCircuit className="h-5 w-5" /> },
    { name: "Random Forest", confidence: "94.8%", icon: <GitBranch className="h-5 w-5" /> },
    { name: "LSTM", confidence: "96.3%", icon: <Brain className="h-5 w-5" /> },
    { name: "XGBoost", confidence: "95.1%", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Transformer", confidence: "98.1%", icon: <Sparkles className="h-5 w-5" /> }
  ];
  
  if (showWelcome) {
    return <FuturisticWelcome />;
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      <div data-main-content className="ml-64 p-8 relative transition-all duration-300"> 
        <AiPulse />
        <Header pageTitle={`Welcome, ${user?.name || 'User'}!`} />
        
        <AiIntroduction />
        
        {/* AI Agent Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-4 mb-8 text-white overflow-hidden relative"
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
              <Drawer open={chatOpen} onOpenChange={setChatOpen}>
                <DrawerTrigger asChild>
                  <Button 
                    className="bg-white hover:bg-white/90 text-indigo-700 border-none shadow-lg" 
                    onClick={() => setChatOpen(true)}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    <span>Ask Co-Pilot</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="p-0 h-[95vh]">
                  <AiChatInterface />
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </motion.div>
        
        {/* Today's Overview */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-ey-darkGray">Today's Overview</h2>
            <div className="ml-2 px-2 py-1 bg-ey-yellow/10 rounded-md text-xs font-medium text-ey-darkGray flex items-center">
              <Brain className="h-3 w-3 mr-1" />
              AI Powered
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button 
                    className="ml-2 text-xs text-blue-500 flex items-center hover:underline"
                    variants={floatVariant}
                    initial="initial"
                    animate="float"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Current Prediction: {predictionModels[activePredictionModel].name}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-1">
                    <p className="font-medium">{predictionModels[activePredictionModel].name} Model</p>
                    <p className="text-xs text-gray-500">Confidence: {predictionModels[activePredictionModel].confidence}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div custom={0} variants={fadeIn}>
              <KpiCard 
                title="Production Yield" 
                value={kpiData.productionYield?.value || "94.8%"} 
                change={kpiData.productionYield?.change || 2.3} 
                icon={<BarChart2 className="h-6 w-6 text-ey-darkGray" />} 
              />
            </motion.div>
            <motion.div custom={1} variants={fadeIn}>
              <KpiCard 
                title="Energy Consumption" 
                value={kpiData.energyConsumption?.value || "1,235 MWh"} 
                change={kpiData.energyConsumption?.change || -5.7} 
                icon={<Zap className="h-6 w-6 text-ey-darkGray" />}
                color="bg-blue-100" 
              />
            </motion.div>
            <motion.div custom={2} variants={fadeIn}>
              <KpiCard 
                title="Quality Rating" 
                value={kpiData.qualityRating?.value || "A+"} 
                change={kpiData.qualityRating?.change || 1.2} 
                icon={<LineChart className="h-6 w-6 text-ey-darkGray" />}
                color="bg-green-100" 
              />
            </motion.div>
            <motion.div custom={3} variants={fadeIn}>
              <KpiCard 
                title="On-Time Delivery" 
                value={kpiData.onTimeDelivery?.value || "92.3%"} 
                change={kpiData.onTimeDelivery?.change || -0.8} 
                icon={<Timer className="h-6 w-6 text-ey-darkGray" />}
                color="bg-purple-100" 
              />
            </motion.div>
          </div>
        </motion.div>
        
        {/* AI Prediction Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-ey-darkGray flex items-center">
              <BrainCircuit className="h-6 w-6 text-blue-500 mr-2" />
              GenAI Prediction Models
            </h2>
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">
              Dynamic Model Selection
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {predictionModels.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0.7, scale: 0.95 }}
                animate={index === activePredictionModel ? { 
                  opacity: 1, 
                  scale: 1,
                  boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.5)' 
                } : { 
                  opacity: 0.7, 
                  scale: 0.95,
                  boxShadow: 'none'
                }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-lg p-4 border cursor-pointer ${
                  index === activePredictionModel 
                    ? 'border-indigo-500' 
                    : 'border-gray-200'
                }`}
                onClick={() => setActivePredictionModel(index)}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-3 ${
                  index === activePredictionModel 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {model.icon}
                </div>
                <h3 className="font-medium text-sm">{model.name}</h3>
                <div className="mt-1 flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        index === activePredictionModel 
                          ? 'bg-indigo-500' 
                          : 'bg-gray-400'
                      }`} 
                      style={{ width: model.confidence }}
                    ></div>
                  </div>
                  <span className={`ml-2 text-xs ${
                    index === activePredictionModel 
                      ? 'text-indigo-600 font-semibold' 
                      : 'text-gray-500'
                  }`}>
                    {model.confidence}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Charts and Insights */}
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
                  <Badge variant="outline" className="ml-2 bg-indigo-50 text-indigo-500 border-indigo-200">
                    {predictionModels[activePredictionModel].name} Analysis
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChart 
                  data={productionData} 
                  color="#2E2E38"
                />
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="text-ey-yellow flex items-center">
                  <span>View detailed report</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>

                <Link to="/analytics" className="ml-auto">
                  <Button variant="outline" size="sm" className="text-indigo-500 border-indigo-200 hover:bg-indigo-50">
                    Advanced Analytics
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <div className="col-span-1">
            <AiInsights insights={insights} />
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
                color="#FFE600"
              />
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="text-ey-yellow flex items-center">
                <span>View efficiency recommendations</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* AI Agents Banner */}
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
              <Button 
                onClick={() => setAiAgentActive(!aiAgentActive)}
                className={`${aiAgentActive 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-white hover:bg-white/90 text-purple-700'}`}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {aiAgentActive ? 'Agents Active' : 'Deploy AI Agents'}
              </Button>
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
                    {['Production Optimizer', 'Supply Chain Analyst', 'Energy Efficiency', 'Quality Monitor', 'Risk Detector'].map((agent, i) => (
                      <motion.div 
                        key={agent}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
                      >
                        <div className="flex items-center mb-2">
                          {agentIcons[i]}
                          <div className="h-2 w-2 bg-green-400 rounded-full ml-auto animate-pulse" />
                        </div>
                        <h4 className="font-medium text-sm">{agent}</h4>
                        <div className="mt-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-white/60 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${70 + Math.random() * 30}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-white/70">Finding patterns...</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Modules Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-ey-darkGray mb-6 flex items-center">
            <BrainCircuit className="h-6 w-6 text-ey-yellow mr-2" />
            <span className="relative">
              AI-Powered Modules
              <span className="absolute -top-1 -right-8">
                <Sparkles className="h-4 w-4 text-ey-yellow animate-pulse" />
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
              />
            </motion.div>
            <motion.div custom={1} variants={fadeIn}>
              <ModuleCard 
                title="Enterprise Supply Planning" 
                description="End-to-end steel supply network visualization and optimization" 
                icon={<Orbit className="h-6 w-6 text-ey-darkGray" />} 
                path="/supply-planning"
                color="bg-blue-100" 
              />
            </motion.div>
            <motion.div custom={2} variants={fadeIn}>
              <ModuleCard 
                title="Order Promising" 
                description="Dynamic ATP calculations for steel products and delivery prediction" 
                icon={<ClipboardList className="h-6 w-6 text-ey-darkGray" />} 
                path="/order-promising"
                color="bg-green-100" 
              />
            </motion.div>
            <motion.div custom={3} variants={fadeIn}>
              <ModuleCard 
                title="Factory Planning" 
                description="Steel production scheduling optimization and resource allocation" 
                icon={<Factory className="h-6 w-6 text-ey-darkGray" />} 
                path="/factory-planning"
                color="bg-purple-100" 
              />
            </motion.div>
            <motion.div custom={4} variants={fadeIn}>
              <ModuleCard 
                title="Inventory Optimization" 
                description="Multi-echelon inventory optimization for raw materials and finished steel products" 
                icon={<Package className="h-6 w-6 text-ey-darkGray" />} 
                path="/inventory-optimization"
                color="bg-orange-100" 
              />
            </motion.div>
            <motion.div custom={5} variants={fadeIn}>
              <ModuleCard 
                title="Inventory Liquidation" 
                description="AI-powered pricing recommendations for liquidation of excess inventory" 
                icon={<Box className="h-6 w-6 text-ey-darkGray" />} 
                path="/inventory-liquidation"
                color="bg-red-100" 
              />
            </motion.div>
            <motion.div custom={6} variants={fadeIn}>
              <ModuleCard 
                title="Logistics Management" 
                description="Route optimization for heavy steel transport and carrier selection" 
                icon={<Truck className="h-6 w-6 text-ey-darkGray" />} 
                path="/logistics"
                color="bg-indigo-100" 
              />
            </motion.div>
            <motion.div custom={7} variants={fadeIn}>
              <ModuleCard 
                title="Risk Management" 
                description="Steel supply chain risk identification and proactive mitigation recommendations" 
                icon={<AlertTriangle className="h-6 w-6 text-ey-darkGray" />} 
                path="/risk-management"
                color="bg-yellow-100" 
              />
            </motion.div>
            <motion.div custom={8} variants={fadeIn}>
              <ModuleCard 
                title="Analytics & Reporting" 
                description="Customizable dashboards and AI-generated narrative insights" 
                icon={<Database className="h-6 w-6 text-ey-darkGray" />} 
                path="/analytics"
                color="bg-teal-100" 
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
