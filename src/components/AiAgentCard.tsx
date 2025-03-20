
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, BarChart3, Zap, CheckCircle, Shield, BrainCircuit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AiAgentProps {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'learning';
  confidence: number;
  icon: string;
  onActivate?: (id: number) => void;
  isExpanded?: boolean;
  deploying?: boolean;
  isUserAgent?: boolean;
}

const AiAgentCard: React.FC<AiAgentProps> = ({ 
  id, 
  name, 
  description, 
  status, 
  confidence, 
  icon,
  onActivate,
  isExpanded = false,
  deploying = false,
  isUserAgent = false
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'truck':
        return <Truck className="h-6 w-6 text-white" />;
      case 'bar-chart':
        return <BarChart3 className="h-6 w-6 text-white" />;
      case 'zap':
        return <Zap className="h-6 w-6 text-white" />;
      case 'check-circle':
        return <CheckCircle className="h-6 w-6 text-white" />;
      case 'shield':
        return <Shield className="h-6 w-6 text-white" />;
      case 'alert-triangle':
        return <Shield className="h-6 w-6 text-white" />;
      case 'globe':
        return <BrainCircuit className="h-6 w-6 text-white" />;
      case 'lightbulb':
        return <BrainCircuit className="h-6 w-6 text-white" />;
      default:
        return <BrainCircuit className="h-6 w-6 text-white" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: id * 0.1 }}
      className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 ${
        isExpanded ? 'col-span-1' : ''
      }`}
    >
      <div className="flex items-center mb-3">
        <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center mr-3">
          {getIcon()}
        </div>
        <div>
          <h3 className="font-medium text-white">{name}</h3>
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full ${
              status === 'active' ? 'bg-green-400' : 
              status === 'learning' ? 'bg-yellow-400' : 'bg-red-400'
            } mr-1.5 animate-pulse`}></div>
            <span className="text-xs text-white/70 capitalize">{status}</span>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <p className="text-sm text-white/80 mb-3">{description}</p>
      )}
      
      <div className="mt-2 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/70">Confidence</span>
          <span className="text-xs text-white/90 font-medium">{confidence}%</span>
        </div>
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-purple-400 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3">
          {deploying || status === 'learning' ? (
            <Button 
              disabled
              variant="outline" 
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {deploying ? "Deploying Agent..." : "Activating Agent..."}
            </Button>
          ) : (
            <Button 
              onClick={() => onActivate && onActivate(id)}
              variant="outline" 
              className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              {isUserAgent ? "Interact with Agent" : "Deploy Agent"}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AiAgentCard;
