import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import AiAgentCard from './AiAgentCard';
import { getAiAgents, getAvailableAgents, addAgentToUser } from '@/services/dataService';
import { Badge } from '@/components/ui/badge';

const AiAgentsDeployment = () => {
  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchAllAgents();
    }
  }, [open]);

  const fetchAllAgents = async () => {
    setLoading(true);
    try {
      const [userAgents, marketplaceAgents] = await Promise.all([
        getAiAgents(),
        getAvailableAgents()
      ]);
      
      setAgents(userAgents);
      
      // Filter out agents that the user already has
      const userAgentIds = userAgents.map((agent: any) => agent.id);
      const filteredAvailableAgents = marketplaceAgents.filter(
        (agent: any) => !userAgentIds.includes(agent.id)
      );
      
      setAvailableAgents(filteredAvailableAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        variant: "destructive",
        title: "Failed to load agents",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const deployAgent = async (id: number) => {
    // Check if agent is already deployed (user already has it)
    const isAlreadyDeployed = agents.some(agent => agent.id === id);
    
    if (isAlreadyDeployed) {
      // If already deployed, just navigate to it
      navigate(`/agent/${id}`);
      setOpen(false);
      return;
    }
    
    // Otherwise, add the agent first
    setDeployingAgent(id);
    
    try {
      // Add the agent to the user's agents
      await addAgentToUser(id);
      
      toast({
        title: "Agent deployed successfully",
        description: `The AI agent is now active and analyzing your steel operations data.`,
      });
      
      // Navigate to the agent's chat interface
      navigate(`/agent/${id}`);
      setOpen(false);
    } catch (error) {
      console.error('Error deploying agent:', error);
      toast({
        variant: "destructive",
        title: "Deployment failed",
        description: "Failed to deploy the agent. Please try again."
      });
    } finally {
      setDeployingAgent(null);
    }
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
        <DialogContent className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white border-none max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-300" />
              EY Steel Ecosystem AI Agents
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Deploy specialized AI agents to continuously analyze your steel operations and provide actionable insights.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 overflow-y-auto px-1">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 text-white/70 animate-spin" />
              </div>
            ) : (
              <div className="mt-4">
                {agents.length > 0 && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Your Active Agents</h3>
                      <Badge className="bg-green-500 text-white">Already Deployed</Badge>
                    </div>
                    
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
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
                          status={agent.status}
                          confidence={agent.confidence}
                          icon={agent.icon}
                          onActivate={deployAgent}
                          isExpanded={true}
                          alreadyDeployed={true}
                        />
                      ))}
                    </motion.div>
                  </>
                )}

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Available Agents</h3>
                  <Badge className="bg-purple-500 text-white">Marketplace</Badge>
                </div>
                
                {availableAgents.length > 0 ? (
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
                    {availableAgents.map((agent) => (
                      <AiAgentCard
                        key={agent.id}
                        id={agent.id}
                        name={agent.name}
                        description={agent.description}
                        status="ready"
                        confidence={agent.confidence}
                        icon={agent.icon}
                        onActivate={deployAgent}
                        isExpanded={true}
                        deploying={deployingAgent === agent.id}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="bg-white/10 rounded-lg p-6 text-center">
                    <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-white/50" />
                    <h4 className="text-lg font-medium mb-2">All Agents Deployed</h4>
                    <p className="text-white/70">
                      You've already deployed all available AI agents to your workspace.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 bg-white/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">About EY Steel Ecosystem AI Agents</h4>
              <p className="text-sm text-white/80">
                Our specialized AI agents use advanced machine learning models to analyze your steel operations, 
                identify optimization opportunities, and predict potential issues before they occur. 
                Each agent focuses on a specific area of your steel business, providing targeted insights and recommendations.
              </p>
            </div>
          </ScrollArea>
          
          <DialogFooter className="pt-4 border-t border-white/10 mt-4">
            <Button 
              variant="secondary" 
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <Button 
              className="bg-purple-500 hover:bg-purple-600"
              onClick={() => navigate('/agents')}
            >
              View All Agents
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiAgentsDeployment;
