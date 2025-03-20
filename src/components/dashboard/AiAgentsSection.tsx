
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import AiAgentsDeployment from '@/components/AiAgentsDeployment';
import AiAgentCard from '@/components/AiAgentCard';

const AiAgentsSection: React.FC = () => {
  const [aiAgentActive, setAiAgentActive] = useState(false);

  return (
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
  );
};

export default AiAgentsSection;
