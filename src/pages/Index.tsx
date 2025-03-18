
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
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

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
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

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

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [energyData, setEnergyData] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any>({});
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useAuth();
  
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
  
  if (showWelcome) {
    return <FuturisticWelcome />;
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-8 relative"> {/* This margin should match the width of the expanded nav */}
        <AiPulse />
        <Header pageTitle={`Welcome, ${user?.name || 'User'}!`} />
        
        <AiIntroduction />
        
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
                <CardDescription>Real-time production data</CardDescription>
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
              <CardDescription>Monitoring energy efficiency</CardDescription>
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
        
        {/* AI Digital Assistant Banner */}
        <motion.div 
          className="mb-8 bg-gradient-to-r from-ey-darkGray to-ey-darkGray/90 rounded-xl p-6 text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-12 w-12 bg-ey-yellow rounded-full flex items-center justify-center mr-4">
                <BrainCircuit className="h-6 w-6 text-ey-darkGray" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Your AI Co-Pilot is Ready</h3>
                <p className="text-white/80">Ask questions, get recommendations, and optimize your steel operations</p>
              </div>
            </div>
            <Drawer open={chatOpen} onOpenChange={setChatOpen}>
              <DrawerTrigger asChild>
                <Button onClick={() => setChatOpen(true)} className="bg-ey-yellow hover:bg-ey-yellow/90 text-ey-darkGray">
                  <span>Start a Conversation</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-0 h-[95vh]">
                <AiChatInterface />
              </DrawerContent>
            </Drawer>
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
