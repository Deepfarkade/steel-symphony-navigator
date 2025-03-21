
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
  Sparkles,
  LockKeyhole
} from 'lucide-react';
import ModuleCard from '@/components/ModuleCard';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

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
  const { hasModuleAccess } = useAuth();
  
  const modules = [
    {
      id: 'demand-planning',
      title: "Demand Planning",
      description: "AI-powered steel demand forecasting with multiple prediction models",
      icon: <BarChart3 className="h-6 w-6 text-ey-darkGray" />,
      path: "/demand-planning",
      color: "bg-purple-100",
      completed: "85"
    },
    {
      id: 'supply-planning',
      title: "Enterprise Supply Planning",
      description: "End-to-end steel supply network visualization and optimization",
      icon: <Orbit className="h-6 w-6 text-ey-darkGray" />,
      path: "/supply-planning",
      color: "bg-blue-100",
      completed: "92"
    },
    {
      id: 'order-promising',
      title: "Order Promising",
      description: "Dynamic ATP calculations for steel products and delivery prediction",
      icon: <ClipboardList className="h-6 w-6 text-ey-darkGray" />,
      path: "/order-promising",
      color: "bg-green-100",
      completed: "78"
    },
    {
      id: 'factory-planning',
      title: "Factory Planning",
      description: "Steel production scheduling optimization and resource allocation",
      icon: <Factory className="h-6 w-6 text-ey-darkGray" />,
      path: "/factory-planning",
      color: "bg-purple-100",
      completed: "64"
    },
    {
      id: 'inventory-optimization',
      title: "Inventory Optimization",
      description: "Multi-echelon inventory optimization for raw materials and finished steel products",
      icon: <Package className="h-6 w-6 text-ey-darkGray" />,
      path: "/inventory-optimization",
      color: "bg-orange-100",
      completed: "73"
    },
    {
      id: 'inventory-liquidation',
      title: "Inventory Liquidation",
      description: "AI-powered pricing recommendations for liquidation of excess inventory",
      icon: <Box className="h-6 w-6 text-ey-darkGray" />,
      path: "/inventory-liquidation",
      color: "bg-red-100",
      completed: "56"
    },
    {
      id: 'logistics',
      title: "Logistics Management",
      description: "Route optimization for heavy steel transport and carrier selection",
      icon: <Truck className="h-6 w-6 text-ey-darkGray" />,
      path: "/logistics",
      color: "bg-indigo-100",
      completed: "81"
    },
    {
      id: 'risk-management',
      title: "Risk Management",
      description: "Steel supply chain risk identification and proactive mitigation recommendations",
      icon: <AlertTriangle className="h-6 w-6 text-ey-darkGray" />,
      path: "/risk-management",
      color: "bg-yellow-100",
      completed: "68"
    },
    {
      id: 'analytics',
      title: "Analytics & Reporting",
      description: "Customizable dashboards and AI-generated narrative insights",
      icon: <Database className="h-6 w-6 text-ey-darkGray" />,
      path: "/analytics",
      color: "bg-teal-100",
      completed: "90"
    }
  ];
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ey-darkGray flex items-center">
          <BrainCircuit className="h-6 w-6 text-purple-500 mr-2" />
          <span className="relative">
            AI-Powered Modules
            <span className="absolute -top-1 -right-8">
              <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            </span>
          </span>
        </h2>
        
        <Badge className="bg-amber-100 text-amber-800 flex items-center">
          <LockKeyhole className="h-3 w-3 mr-1" />
          Some modules require special access
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const userHasAccess = hasModuleAccess(module.id);
          
          return (
            <motion.div key={module.id} custom={index} variants={fadeIn}>
              <ModuleCard 
                title={module.title} 
                description={module.description} 
                icon={module.icon} 
                path={module.path} 
                color={module.color}
                completed={module.completed}
                restricted={!userHasAccess}
              />
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Access Notice:</strong> Some modules may be restricted based on your user permissions. 
            If you need access to a specific module, please contact your administrator.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AiModules;
