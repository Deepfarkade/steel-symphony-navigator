
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Loader2, Trash, LockKeyhole, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from 'react-router-dom';
import AiAgentCard from './AiAgentCard';
import { getAvailableAgents, addAgentToUser } from '@/services/dataService';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAgents } from '@/hooks/useAgents';
import { useAuth } from '@/context/AuthContext';

const AiAgentsDeployment = () => {
  const [open, setOpen] = useState(false);
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const [selectedAgentToRemove, setSelectedAgentToRemove] = useState<any | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [deniedAgentName, setDeniedAgentName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { agents, refreshAgents, deleteAgent } = useAgents();
  const { user, hasAgentAccess } = useAuth();
  const userIsAdmin = user?.role === 'admin';

  // Fetch available agents when the dialog opens or user agents change
  useEffect(() => {
    if (open) {
      fetchAvailableAgents();
    }
  }, [open, agents]);

  const fetchAvailableAgents = async () => {
    if (!open) return;
    
    setLoading(true);
    try {
      const data = await getAvailableAgents();
      setAvailableAgents(data);
    } catch (error) {
      console.error('Error fetching available agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToMarketplace = () => {
    setOpen(false);
    navigate('/agents');
  };

  const deployAgent = async (id: number) => {
    // Check if the agent is already deployed
    const isAlreadyDeployed = agents.some(agent => agent.id === id);
    
    if (isAlreadyDeployed) {
      // Check if user has permission to access this agent
      if (!hasAgentAccess(id)) {
        const agent = agents.find(a => a.id === id);
        setDeniedAgentName(agent?.name || 'this agent');
        setShowAccessDeniedDialog(true);
        return;
      }
      
      navigate(`/agent/${id}`);
      setOpen(false);
      return;
    }
    
    // Check if user has permission to deploy this agent
    if (!hasAgentAccess(id)) {
      const agent = availableAgents.find(a => a.id === id);
      setDeniedAgentName(agent?.name || 'this agent');
      setShowAccessDeniedDialog(true);
      return;
    }
    
    setDeployingAgent(id);
    
    try {
      await addAgentToUser(id);
      
      // Refresh user's agents and available agents
      await refreshAgents();
      await fetchAvailableAgents();
      
      toast({
        title: "Agent deployed successfully",
        description: `The AI agent is now active and analyzing your steel operations data.`,
      });
      
      // Navigate to the newly added agent
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

  const handleRemoveAgent = (agent: any) => {
    setSelectedAgentToRemove(agent);
    setShowRemoveDialog(true);
  };

  const confirmRemoveAgent = async () => {
    if (!selectedAgentToRemove) return;
    
    try {
      await deleteAgent(selectedAgentToRemove.id);
      
      // Refresh both lists after deletion
      await refreshAgents();
      await fetchAvailableAgents();
      
      // If on the agent page, redirect to agents page
      if (window.location.pathname === `/agent/${selectedAgentToRemove.id}`) {
        navigate('/agents');
      }
      
      setShowRemoveDialog(false);
      setSelectedAgentToRemove(null);
    } catch (error) {
      console.error('Error removing agent:', error);
      toast({
        variant: "destructive",
        title: "Removal failed",
        description: "Failed to remove the agent. Please try again."
      });
    }
  };

  // Filter to show only user's authorized agents
  const accessibleAgents = agents.filter(agent => hasAgentAccess(agent.id));

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
              {accessibleAgents.length > 0 && (
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
                          staggerChildren: 0.05 // Faster loading
                        }
                      }
                    }}
                  >
                    {accessibleAgents.map((agent) => (
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
                        showAccessIndicator={false} // Hide indicator for already deployed agents
                      />
                    ))}
                  </motion.div>
                </>
              )}

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Available Agents</h3>
                <Badge className="bg-purple-500 text-white">Marketplace</Badge>
              </div>
              
              {loading ? (
                <div className="bg-white/10 rounded-lg p-6 text-center">
                  <Loader2 className="h-10 w-10 mx-auto mb-4 text-white/50 animate-spin" />
                  <h4 className="text-lg font-medium mb-2">Loading Agents</h4>
                  <p className="text-white/70">
                    Please wait while we fetch available AI agents...
                  </p>
                </div>
              ) : availableAgents.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05 // Faster loading
                      }
                    }
                  }}
                >
                  {availableAgents.slice(0, 6).map((agent) => (
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
                      showAccessIndicator={true} // Show access indicator for marketplace agents
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
              
              {availableAgents.length > 6 && (
                <div className="mt-4 text-center">
                  <Button 
                    onClick={goToMarketplace}
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    View more agents in the marketplace
                  </Button>
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
            {userIsAdmin && (
              <Button 
                className="bg-indigo-500 hover:bg-indigo-600"
                onClick={() => {
                  setOpen(false);
                  navigate('/create-agent');
                }}
              >
                Create Custom Agent
              </Button>
            )}
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
      
      {/* Access Denied Dialog */}
      <AlertDialog open={showAccessDeniedDialog} onOpenChange={setShowAccessDeniedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Access Restricted
            </AlertDialogTitle>
            <AlertDialogDescription>
              You don't have permission to use {deniedAgentName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 bg-amber-50 rounded-md">
            <p className="text-sm text-amber-800">
              This agent requires special permission. Please contact your administrator to request access.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AiAgentsDeployment;
