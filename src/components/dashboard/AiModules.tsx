
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Orbit, 
  ClipboardList, 
  Factory, 
  Package, 
  Box, 
  Truck, 
  AlertTriangle,
  Database,
  BrainCircuit, 
  Sparkles 
} from 'lucide-react';
import ModuleCard from '@/components/ModuleCard';

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

const AiModules: React.FC = () => {
  return (
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
  );
};

export default AiModules;
