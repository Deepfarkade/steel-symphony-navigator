
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AiAgentCard from './AiAgentCard';
import { getAiAgents } from '@/services/dataService';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const AiAgentsDeployment = () => {
  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchAgents();
    }
  }, [open]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await getAiAgents();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching AI agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const deployAgent = (id: number) => {
    setDeployingAgent(id);
    
    // Simulate deployment process
    setTimeout(() => {
      setDeployingAgent(null);
      
      // Find the deployed agent details
      const deployedAgent = agents.find(agent => agent.id === id);
      
      toast({
        title: `${deployedAgent?.name || 'Agent'} deployed successfully`,
        description: `The AI agent is now active and analyzing your steel operations data.`,
      });
      
      // Navigate to chat with the specific agent
      navigate(`/chat?agent=${id}`);
      
      // Close the dialog
      setOpen(false);
    }, 2000);
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <BrainCircuit className="h-4 w-4 mr-2" />
        Deploy AI Agents
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white border-none max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-300" />
              EY Steel Ecosystem AI Agents
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Deploy specialized AI agents to continuously analyze your steel operations and provide actionable insights.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Available Agents</h3>
              <Badge className="bg-ey-yellow text-black">Powered by EY SECP</Badge>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-40 bg-white/5 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {agents.map((agent) => (
                  <AiAgentCard
                    key={agent.id}
                    id={agent.id}
                    name={agent.name}
                    description={agent.description}
                    status={deployingAgent === agent.id ? 'learning' : agent.status}
                    confidence={agent.confidence}
                    icon={agent.icon}
                    onActivate={deployAgent}
                    isExpanded={true}
                  />
                ))}
                
                {/* Add New Agent Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: agents.length * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/20 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors h-full min-h-[200px]"
                  onClick={() => toast({
                    title: "Coming Soon",
                    description: "Custom agent creation will be available soon."
                  })}
                >
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-white text-center mb-2">Create Custom Agent</h3>
                  <p className="text-sm text-white/70 text-center">
                    Design your own AI agent for specific steel industry needs
                  </p>
                </motion.div>
              </motion.div>
            )}
          </div>
          
          <div className="mt-6 bg-white/10 p-4 rounded-lg">
            <h4 className="font-medium mb-2">About EY Steel Ecosystem AI Agents</h4>
            <p className="text-sm text-white/80">
              Our specialized AI agents use advanced machine learning models to analyze your steel operations, 
              identify optimization opportunities, and predict potential issues before they occur. 
              Each agent focuses on a specific area of your steel business, providing targeted insights and recommendations.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiAgentsDeployment;
