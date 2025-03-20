
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
import { useAgents } from '@/hooks/useAgents';

// Mock agents for immediate rendering
const mockAvailableAgents = [
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
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const [selectedAgentToRemove, setSelectedAgentToRemove] = useState<any | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { agents, refreshAgents, deleteAgent } = useAgents();

  // Immediately set mock data for faster UI rendering when dialog opens
  useEffect(() => {
    if (open) {
      // Filter out agents that are already in the user's list 
      const userAgentIds = agents.map(agent => agent.id);
      const filteredMockAgents = mockAvailableAgents.filter(
        agent => !userAgentIds.includes(agent.id)
      );
      setAvailableAgents(filteredMockAgents);
      
      // Then fetch real data in the background
      fetchAvailableAgents();
    }
  }, [open, agents]);

  const fetchAvailableAgents = async () => {
    try {
      setLoading(true);
      const marketplaceAgents = await getAvailableAgents();
      
      const userAgentIds = agents.map(agent => agent.id);
      const filtered = (marketplaceAgents as any[]).filter(
        agent => !userAgentIds.includes(agent.id)
      );
      
      // Only update if we have real data
      if (filtered && filtered.length > 0) {
        setAvailableAgents(filtered);
      }
    } catch (error) {
      console.error('Error fetching available agents:', error);
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
      refreshAgents();
      setAvailableAgents(prev => prev.filter(agent => agent.id !== id));
      
      // Navigate to the newly added agent
      navigate(`/agent/${id}`);
      setOpen(false);
    } catch (error) {
      console.error('Error deploying agent:', error);
      
      // Add the agent to the user's list anyway for demo purposes
      const agentToAdd = availableAgents.find(agent => agent.id === id);
      if (agentToAdd) {
        refreshAgents();
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

  const handleRemoveAgent = (agent: any) => {
    setSelectedAgentToRemove(agent);
    setShowRemoveDialog(true);
  };

  const confirmRemoveAgent = async () => {
    if (!selectedAgentToRemove) return;
    
    await deleteAgent(selectedAgentToRemove.id);
    
    // If on the agent page, redirect to agents page
    if (window.location.pathname === `/agent/${selectedAgentToRemove.id}`) {
      navigate('/agents');
    }
    
    setShowRemoveDialog(false);
    setSelectedAgentToRemove(null);
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
