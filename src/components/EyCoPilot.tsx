
import React, { useEffect, useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { getCoPilotAnalytics } from '@/services/dataService';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const EyCoPilot: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    modelsAnalyzed: 0,
    dataPointsProcessed: 0,
    predictionsGenerated: 0,
    status: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getCoPilotAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching Co-Pilot analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleAskCoPilot = () => {
    // Open the chat interface or navigate to chat page
    navigate('/chat');
    
    toast({
      title: "Co-Pilot Activated",
      description: "The EY Steel Co-Pilot is ready to assist you."
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-600 text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between mb-6"
    >
      <div className="flex items-center mb-4 md:mb-0">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
          <BrainCircuit className="h-6 w-6 text-white" />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            EY Steel Ecosystem Co-Pilot
            <Sparkles className="h-4 w-4 ml-2 text-yellow-300" />
          </h2>
          
          <div className="flex items-center mt-1">
            <span className="text-sm">AI Agent Status:</span>
            <div className="flex items-center ml-2 bg-purple-800/50 px-2 py-0.5 rounded-full">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></div>
              {loading ? (
                <Skeleton className="h-4 w-20 bg-purple-700/50" />
              ) : (
                <span className="text-xs">{analytics.status}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <div className="text-center">
          <p className="text-xs uppercase text-purple-200">Models Analyzed</p>
          {loading ? (
            <Skeleton className="h-6 w-12 mx-auto bg-purple-700/50" />
          ) : (
            <p className="text-2xl font-bold">{analytics.modelsAnalyzed}</p>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-xs uppercase text-purple-200">Data Points Processed</p>
          {loading ? (
            <Skeleton className="h-6 w-16 mx-auto bg-purple-700/50" />
          ) : (
            <p className="text-2xl font-bold">{analytics.dataPointsProcessed.toLocaleString()}</p>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-xs uppercase text-purple-200">Predictions Generated</p>
          {loading ? (
            <Skeleton className="h-6 w-12 mx-auto bg-purple-700/50" />
          ) : (
            <p className="text-2xl font-bold">{analytics.predictionsGenerated}</p>
          )}
        </div>
        
        <Button 
          onClick={handleAskCoPilot}
          className="ml-0 md:ml-4 bg-white text-purple-700 hover:bg-white/90 shadow-lg"
        >
          <BrainCircuit className="h-4 w-4 mr-2" />
          Ask Co-Pilot
        </Button>
      </div>
    </motion.div>
  );
};

export default EyCoPilot;
