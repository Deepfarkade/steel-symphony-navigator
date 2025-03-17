
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
  Bot
} from 'lucide-react';

import Navigation from '../components/Navigation';
import Header from '../components/Header';
import KpiCard from '../components/KpiCard';
import AreaChart from '../components/AreaChart';
import AiInsights from '../components/AiInsights';
import ModuleCard from '../components/ModuleCard';
import AiPulse from '../components/AiPulse';
import FuturisticWelcome from '../components/FuturisticWelcome';
import AiIntroduction from '../components/AiIntroduction';

const productionData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const energyConsumptionData = [
  { name: 'Jan', value: 2400 },
  { name: 'Feb', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Apr', value: 3908 },
  { name: 'May', value: 4800 },
  { name: 'Jun', value: 3800 },
  { name: 'Jul', value: 4300 },
];

const aiInsights = [
  {
    id: 1,
    type: 'alert' as const,
    message: 'Blast furnace #3 showing abnormal temperature fluctuations. Maintenance recommended.',
    timestamp: '3 hours ago'
  },
  {
    id: 2,
    type: 'suggestion' as const,
    message: 'Energy efficiency could be improved by 12% by optimizing production scheduling.',
    timestamp: '5 hours ago'
  },
  {
    id: 3,
    type: 'opportunity' as const,
    message: 'Detected increased demand pattern for high-grade steel in automotive sector.',
    timestamp: '8 hours ago'
  },
  {
    id: 4,
    type: 'success' as const,
    message: 'Quality metrics for stainless steel production have improved by 8% this month.',
    timestamp: '1 day ago'
  },
];

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (showWelcome) {
    return <FuturisticWelcome />;
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-8 relative"> {/* This margin should match the width of the expanded nav */}
        <AiPulse />
        <Header pageTitle="Steel Ecosystem Co-Pilot" />
        
        <AiIntroduction />
        
        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-stagger">
          <KpiCard 
            title="Production Yield" 
            value="94.8%" 
            change={2.3} 
            icon={<BarChart2 className="h-6 w-6 text-ey-darkGray" />} 
          />
          <KpiCard 
            title="Energy Consumption" 
            value="1,235 MWh" 
            change={-5.7} 
            icon={<Zap className="h-6 w-6 text-ey-darkGray" />}
            color="bg-blue-100" 
          />
          <KpiCard 
            title="Quality Rating" 
            value="A+" 
            change={1.2} 
            icon={<LineChart className="h-6 w-6 text-ey-darkGray" />}
            color="bg-green-100" 
          />
          <KpiCard 
            title="On-Time Delivery" 
            value="92.3%" 
            change={-0.8} 
            icon={<Timer className="h-6 w-6 text-ey-darkGray" />}
            color="bg-purple-100" 
          />
        </div>
        
        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <div className="col-span-2">
            <AreaChart 
              data={productionData} 
              title="Steel Production (tons)" 
              color="#2E2E38"
            />
          </div>
          <div className="col-span-1">
            <AiInsights insights={aiInsights} />
          </div>
        </div>
        
        <div className="mb-8 animate-fade-in">
          <AreaChart 
            data={energyConsumptionData} 
            title="Energy Consumption (MWh)" 
            color="#FFE600"
          />
        </div>
        
        {/* Modules Section */}
        <h2 className="text-2xl font-bold text-ey-darkGray mb-6 flex items-center">
          <BrainCircuit className="h-6 w-6 text-ey-yellow mr-2" />
          <span className="relative">
            AI-Powered Modules
            <span className="absolute -top-1 -right-8">
              <Sparkles className="h-4 w-4 text-ey-yellow animate-pulse" />
            </span>
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animate">
          <ModuleCard 
            title="Demand Planning" 
            description="AI-powered steel demand forecasting with multiple prediction models" 
            icon={<BarChart3 className="h-6 w-6 text-ey-darkGray" />} 
            path="/demand-planning" 
          />
          <ModuleCard 
            title="Enterprise Supply Planning" 
            description="End-to-end steel supply network visualization and optimization" 
            icon={<Orbit className="h-6 w-6 text-ey-darkGray" />} 
            path="/supply-planning"
            color="bg-blue-100" 
          />
          <ModuleCard 
            title="Order Promising" 
            description="Dynamic ATP calculations for steel products and delivery prediction" 
            icon={<ClipboardList className="h-6 w-6 text-ey-darkGray" />} 
            path="/order-promising"
            color="bg-green-100" 
          />
          <ModuleCard 
            title="Factory Planning" 
            description="Steel production scheduling optimization and resource allocation" 
            icon={<Factory className="h-6 w-6 text-ey-darkGray" />} 
            path="/factory-planning"
            color="bg-purple-100" 
          />
          <ModuleCard 
            title="Inventory Optimization" 
            description="Multi-echelon inventory optimization for raw materials and finished steel products" 
            icon={<Package className="h-6 w-6 text-ey-darkGray" />} 
            path="/inventory-optimization"
            color="bg-orange-100" 
          />
          <ModuleCard 
            title="Inventory Liquidation" 
            description="AI-powered pricing recommendations for liquidation of excess inventory" 
            icon={<Box className="h-6 w-6 text-ey-darkGray" />} 
            path="/inventory-liquidation"
            color="bg-red-100" 
          />
          <ModuleCard 
            title="Logistics Management" 
            description="Route optimization for heavy steel transport and carrier selection" 
            icon={<Truck className="h-6 w-6 text-ey-darkGray" />} 
            path="/logistics"
            color="bg-indigo-100" 
          />
          <ModuleCard 
            title="Risk Management" 
            description="Steel supply chain risk identification and proactive mitigation recommendations" 
            icon={<AlertTriangle className="h-6 w-6 text-ey-darkGray" />} 
            path="/risk-management"
            color="bg-yellow-100" 
          />
          <ModuleCard 
            title="Analytics & Reporting" 
            description="Customizable dashboards and AI-generated narrative insights" 
            icon={<Database className="h-6 w-6 text-ey-darkGray" />} 
            path="/analytics"
            color="bg-teal-100" 
          />
        </div>
        
        {/* AI Assistant Hint */}
        <div className="fixed bottom-8 right-8 bg-ey-darkGray/90 text-white p-4 rounded-lg flex items-center animate-bounce shadow-lg max-w-xs backdrop-blur-sm">
          <Bot className="h-6 w-6 text-ey-yellow mr-2" />
          <div>
            <p className="font-medium">AI Co-Pilot Active</p>
            <p className="text-sm text-gray-300">Ask me anything about steel manufacturing!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
