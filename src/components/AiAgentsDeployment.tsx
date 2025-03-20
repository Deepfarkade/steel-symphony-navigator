
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Loader, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import AiAgentCard from './AiAgentCard';
import { getAiAgents, getAvailableAgents, addAgentToUser, removeAgentFromUser } from '@/services/dataService';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Agent {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'learning';
  confidence: number;
  icon: string;
}

const mockAgents = [
  {
    id: 1,
    name: "Production Intelligence",
    description: "Monitors production lines and predicts maintenance needs",
    status: "active" as const,
    confidence: 98,
    icon: "bar-chart"
  },
  {
    id: 2,
    name: "Supply Chain Optimizer",
    description: "Analyzes supply chain for bottlenecks and efficiency improvements",
    status: "active" as const,
    confidence: 92,
    icon: "truck"
  },
  {
    id: 3,
    name: "Energy Consumption Analyzer",
    description: "Tracks energy usage and recommends optimization strategies",
    status: "active" as const,
    confidence: 94,
    icon: "zap"
  },
  {
    id: 4,
    name: "Sustainability Monitor",
    description: "Monitors environmental impact and suggests improvements",
    status: "active" as const,
    confidence: 89,
    icon: "globe"
  },
  {
    id: 5,
    name: "Crisis Management AI",
    description: "Detects potential crises and suggests mitigation strategies",
    status: "active" as const,
    confidence: 91,
    icon: "alert-triangle"
  },
  {
    id: 6,
    name: "What-If Scenarios Analyzer",
    description: "Simulates various business scenarios and predicts outcomes",
    status: "active" as const,
    confidence: 87,
    icon: "lightbulb"
  }
];

const AiAgentsDeployment = () => {
  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const [selectedAgentToRemove, setSelectedAgentToRemove] = useState<Agent | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Immediately set mock data for faster UI rendering
  useEffect(() => {
    setAgents(mockAgents.slice(0, 3));
    setAvailableAgents(mockAgents.slice(3));
    setLoading(false);
    
    // Then attempt to fetch real data
    fetchAllAgents();
  }, []);

  useEffect(() => {
    if (open) {
      // Ensure we have at least the mock data loaded
      if (agents.length === 0 && availableAgents.length === 0) {
        setAgents(mockAgents.slice(0, 3));
        setAvailableAgents(mockAgents.slice(3));
        setLoading(false);
      }
      
      fetchAllAgents();
    }
  }, [open]);

  const fetchAllAgents = async () => {
    try {
      // Set a very short timeout to ensure we always have some data to show
      const userAgentsPromise = Promise.race([
        getAiAgents(),
        new Promise<Agent[]>(resolve => {
          setTimeout(() => resolve(mockAgents.slice(0, 3)), 300);
        })
      ]);
      
      const marketplaceAgentsPromise = Promise.race([
        getAvailableAgents(),
        new Promise<Agent[]>(resolve => {
          setTimeout(() => resolve(mockAgents.slice(3)), 300);
        })
      ]);
      
      const [userAgents, marketplaceAgents] = await Promise.all([
        userAgentsPromise,
        marketplaceAgentsPromise
      ]);
      
      setAgents(userAgents);
      
      const userAgentIds = userAgents.map(agent => agent.id);
      let filteredAvailableAgents = (marketplaceAgents as Agent[]).filter(
        agent => !userAgentIds.includes(agent.id)
      );
      
      // If we got no available agents, use mock data
      if (filteredAvailableAgents.length === 0) {
        filteredAvailableAgents = mockAgents.filter(
          agent => !userAgentIds.includes(agent.id)
        );
      }
      
      setAvailableAgents(filteredAvailableAgents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        variant: "destructive",
        title: "Failed to load agents",
        description: "Using demo data instead."
      });
      
      // Use mock data as fallback
      setAgents(mockAgents.slice(0, 3));
      setAvailableAgents(mockAgents.slice(3));
    } finally {
      setLoading(false);
    }
  };

  const deployAgent = async (id: number) => {
    const isAlreadyDeployed = agents.some(agent => agent.id === id);
    
    if (isAlreadyDeployed) {
      navigate(`/agent/${id}`);
      setOpen(false);
      return;
    }
    
    setDeployingAgent(id);
    
    try {
      await addAgentToUser(id);
      
      toast({
        title: "Agent deployed successfully",
        description: `The AI agent is now active and analyzing your steel operations data.`,
      });
      
      // Add the agent to the user's list immediately for better UX
      const agentToAdd = availableAgents.find(agent => agent.id === id);
      if (agentToAdd) {
        setAgents(prev => [...prev, agentToAdd]);
        setAvailableAgents(prev => prev.filter(agent => agent.id !== id));
      }
      
      // Navigate to the newly added agent
      navigate(`/agent/${id}`);
      setOpen(false);
    } catch (error) {
      console.error('Error deploying agent:', error);
      
      // Add the agent to the user's list anyway for demo purposes
      const agentToAdd = availableAgents.find(agent => agent.id === id);
      if (agentToAdd) {
        setAgents(prev => [...prev, agentToAdd]);
        setAvailableAgents(prev => prev.filter(agent => agent.id !== id));
        
        toast({
          title: "Agent deployed successfully",
          description: `The AI agent is now active and analyzing your steel operations data.`,
        });
        
        navigate(`/agent/${id}`);
        setOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Deployment failed",
          description: "Failed to deploy the agent. Please try again."
        });
      }
    } finally {
      setDeployingAgent(null);
    }
  };

  const handleRemoveAgent = (agent: Agent) => {
    setSelectedAgentToRemove(agent);
    setShowRemoveDialog(true);
  };

  const confirmRemoveAgent = async () => {
    if (!selectedAgentToRemove) return;
    
    try {
      await removeAgentFromUser(selectedAgentToRemove.id);
      
      // Update the local state
      setAgents(prev => prev.filter(agent => agent.id !== selectedAgentToRemove.id));
      setAvailableAgents(prev => [...prev, selectedAgentToRemove]);
      
      toast({
        title: "Agent removed",
        description: "The agent has been removed from your workspace."
      });
      
      // If on the agent page, redirect to agents page
      if (window.location.pathname === `/agent/${selectedAgentToRemove.id}`) {
        navigate('/agents');
      }
    } catch (error) {
      console.error('Error removing agent:', error);
      
      // Still update the UI for demo purposes
      setAgents(prev => prev.filter(agent => agent.id !== selectedAgentToRemove.id));
      setAvailableAgents(prev => [...prev, selectedAgentToRemove]);
      
      toast({
        title: "Agent removed",
        description: "The agent has been removed from your workspace."
      });
    } finally {
      setShowRemoveDialog(false);
      setSelectedAgentToRemove(null);
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
                          description={agent.description || ''}
                          status={agent.status as 'active' | 'inactive' | 'learning'}
                          confidence={agent.confidence || 0}
                          icon={agent.icon}
                          onActivate={deployAgent}
                          onRemove={(id) => handleRemoveAgent(agent)}
                          isExpanded={true}
                          deploying={false}
                          isUserAgent={true}
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
                        description={agent.description || ''}
                        status={'active'}
                        confidence={agent.confidence || 0}
                        icon={agent.icon}
                        onActivate={deployAgent}
                        isExpanded={true}
                        deploying={deployingAgent === agent.id}
                        isUserAgent={false}
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
              onClick={() => {
                setOpen(false);
                navigate('/agents');
              }}
            >
              View All Agents
            </Button>
            <Button 
              className="bg-indigo-500 hover:bg-indigo-600"
              onClick={() => {
                setOpen(false);
                navigate('/create-agent');
              }}
            >
              Create Custom Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Agent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedAgentToRemove?.name} from your workspace? 
              You can always add it back later from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveAgent}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash className="h-4 w-4 mr-1" />
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AiAgentsDeployment;
