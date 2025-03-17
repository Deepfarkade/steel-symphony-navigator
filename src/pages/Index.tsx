
import React from 'react';
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
  Timer
} from 'lucide-react';

import Navigation from '../components/Navigation';
import Header from '../components/Header';
import KpiCard from '../components/KpiCard';
import AreaChart from '../components/AreaChart';
import AiInsights from '../components/AiInsights';
import ModuleCard from '../components/ModuleCard';

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
    type: 'alert',
    message: 'Blast furnace #3 showing abnormal temperature fluctuations. Maintenance recommended.',
    timestamp: '3 hours ago'
  },
  {
    id: 2,
    type: 'suggestion',
    message: 'Energy efficiency could be improved by 12% by optimizing production scheduling.',
    timestamp: '5 hours ago'
  },
  {
    id: 3,
    type: 'opportunity',
    message: 'Detected increased demand pattern for high-grade steel in automotive sector.',
    timestamp: '8 hours ago'
  },
  {
    id: 4,
    type: 'success',
    message: 'Quality metrics for stainless steel production have improved by 8% this month.',
    timestamp: '1 day ago'
  },
];

const Index = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-8"> {/* This margin should match the width of the expanded nav */}
        <Header pageTitle="Steel Ecosystem Co-Pilot" />
        
        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
        
        <div className="mb-8">
          <AreaChart 
            data={energyConsumptionData} 
            title="Energy Consumption (MWh)" 
            color="#FFE600"
          />
        </div>
        
        {/* Modules Section */}
        <h2 className="text-2xl font-bold text-ey-darkGray mb-6">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default Index;
