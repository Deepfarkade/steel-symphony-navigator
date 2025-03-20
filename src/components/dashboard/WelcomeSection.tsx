
import React from 'react';
import { motion } from 'framer-motion';
import { BrainCog, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface WelcomeSectionProps {
  aiStats: {
    modelsAnalyzed: number;
    dataPointsProcessed: number;
    predictionsGenerated: number;
  };
}

const pulseVariant = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  }
};

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ aiStats }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAskCoPilot = () => {
    // Navigate directly to the chat page
    navigate('/chat');
    
    toast({
      title: "Co-Pilot Activated",
      description: "Your EY Steel Ecosystem Co-Pilot is ready to assist you.",
    });
  };

  return (
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
  );
};

export default WelcomeSection;
