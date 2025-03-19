
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AiChatInterface from '@/components/AiChatInterface';
import { ArrowLeft, Brain, BrainCircuit, Database, Factory, Package, BarChart3, Truck, AlertTriangle, Orbit, ClipboardList, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ModuleInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface ModuleChatParams {
  module?: string;
}

const ModuleChatPage = () => {
  const { module } = useParams<ModuleChatParams>();
  const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null);
  
  useEffect(() => {
    // Map module path to module info
    const moduleMap: Record<string, ModuleInfo> = {
      'demand-planning': {
        title: 'Demand Planning Assistant',
        description: 'AI-powered support for forecasting and analyzing steel demand patterns',
        icon: <BarChart3 className="h-6 w-6 text-white" />,
        color: 'from-amber-600 to-orange-600'
      },
      'supply-planning': {
        title: 'Supply Planning Assistant',
        description: 'Strategic guidance for optimizing your steel supply network',
        icon: <Orbit className="h-6 w-6 text-white" />,
        color: 'from-blue-600 to-indigo-600'
      },
      'order-promising': {
        title: 'Order Promising Assistant',
        description: 'Intelligent support for order management and delivery predictions',
        icon: <ClipboardList className="h-6 w-6 text-white" />,
        color: 'from-green-600 to-emerald-600'
      },
      'factory-planning': {
        title: 'Factory Planning Assistant',
        description: 'AI co-pilot for optimizing steel production scheduling',
        icon: <Factory className="h-6 w-6 text-white" />,
        color: 'from-purple-600 to-violet-600'
      },
      'inventory-optimization': {
        title: 'Inventory Optimization Assistant',
        description: 'Smart analysis for improving inventory management across your steel operations',
        icon: <Package className="h-6 w-6 text-white" />,
        color: 'from-orange-600 to-red-600'
      },
      'inventory-liquidation': {
        title: 'Inventory Liquidation Assistant',
        description: 'AI-powered strategies for efficient excess inventory management',
        icon: <Box className="h-6 w-6 text-white" />,
        color: 'from-red-600 to-pink-600'
      },
      'logistics': {
        title: 'Logistics Management Assistant',
        description: 'Intelligent routing and transportation optimization for steel products',
        icon: <Truck className="h-6 w-6 text-white" />,
        color: 'from-indigo-600 to-blue-600'
      },
      'risk-management': {
        title: 'Risk Management Assistant',
        description: 'Proactive identification and mitigation of risks in your steel supply chain',
        icon: <AlertTriangle className="h-6 w-6 text-white" />,
        color: 'from-yellow-600 to-amber-600'
      },
      'analytics': {
        title: 'Analytics Assistant',
        description: 'Deep insights from your steel operations data with AI-powered analysis',
        icon: <Database className="h-6 w-6 text-white" />,
        color: 'from-teal-600 to-cyan-600'
      }
    };
    
    if (module && moduleMap[module]) {
      setModuleInfo(moduleMap[module]);
    } else {
      // Default fallback
      setModuleInfo({
        title: 'Module Assistant',
        description: 'AI-powered support for your steel manufacturing operations',
        icon: <BrainCircuit className="h-6 w-6 text-white" />,
        color: 'from-gray-700 to-gray-900'
      });
    }
  }, [module]);
  
  if (!moduleInfo) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navigation />
        <div data-main-content className="ml-64 p-8">
          <Header pageTitle="Module Chat" />
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ey-yellow"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      <div data-main-content className="ml-64 p-8">
        <Header pageTitle={moduleInfo.title} />
        
        <div className="mb-6">
          <Link to={`/${module || ''}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {module?.replace('-', ' ') || 'Dashboard'}
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mb-6 bg-gradient-to-r ${moduleInfo.color} rounded-xl p-6 text-white`}
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
              {moduleInfo.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{moduleInfo.title}</h1>
              <p className="text-white/80">{moduleInfo.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 text-white mr-2" />
                <h3 className="font-semibold">Specialized Knowledge</h3>
              </div>
              <p className="text-sm text-white/80">This assistant has specialized knowledge about {module?.replace('-', ' ')} in steel manufacturing.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <BrainCircuit className="h-5 w-5 text-white mr-2" />
                <h3 className="font-semibold">Context-Aware</h3>
              </div>
              <p className="text-sm text-white/80">Your conversations are enriched with real-time data from your {module?.replace('-', ' ')} operations.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 text-white mr-2" />
                <h3 className="font-semibold">Task Automation</h3>
              </div>
              <p className="text-sm text-white/80">Ask the assistant to perform specific {module?.replace('-', ' ')} tasks or data analyses for you.</p>
            </div>
          </div>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <AiChatInterface moduleContext={module} />
        </div>
      </div>
    </div>
  );
};

export default ModuleChatPage;
