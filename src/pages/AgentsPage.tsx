
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import { getAvailableAgents, addAgentToUser } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAgents } from '@/hooks/useAgents';
import AgentsMarketplaceHeader from '@/components/agents/AgentsMarketplaceHeader';
import AgentsSearchBar from '@/components/agents/AgentsSearchBar';
import MarketplaceAgentsList from '@/components/agents/MarketplaceAgentsList';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AgentsPage = () => {
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const [deniedAgentName, setDeniedAgentName] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { agents, refreshAgents } = useAgents();
  const { hasAgentAccess } = useAuth();

  // Ensure the page starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch available agents that are not deployed by the user
  useEffect(() => {
    fetchMarketplaceAgents();
  }, [agents]); // Re-fetch marketplace when user agents change

  const fetchMarketplaceAgents = async () => {
    try {
      setLoading(true);
      const data = await getAvailableAgents();
      setAvailableAgents(data);
    } catch (error) {
      console.error('Error fetching marketplace agents:', error);
      toast({
        title: "Failed to fetch agents",
        description: "Could not load the available agents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeployAgent = async (agentId: number) => {
    // Check if user has permission to deploy this agent
    if (!hasAgentAccess(agentId)) {
      const agent = availableAgents.find(a => a.id === agentId);
      setDeniedAgentName(agent?.name || 'this agent');
      setShowAccessDeniedDialog(true);
      return;
    }
    
    setDeployingAgent(agentId);
    try {
      await addAgentToUser(agentId);
      
      // Refresh both lists - user agents and available agents
      await refreshAgents();
      // Marketplace will be updated due to the useEffect dependency on agents
      
      toast({
        title: "Agent Deployed",
        description: "The AI agent has been successfully deployed to your workspace."
      });
      
      // Navigate to the agent page
      navigate(`/agent/${agentId}`);
    } catch (error) {
      console.error('Error deploying agent:', error);
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy the agent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeployingAgent(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div data-main-content className="ml-64 p-8 transition-all duration-300">
        <Header 
          pageTitle="AI Agent Marketplace"
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'AI Agent Marketplace', link: '/agents' }
          ]}
        />
        
        <div className="mb-8">
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <AgentsMarketplaceHeader />
            </CardHeader>
            <CardContent className="pt-6">
              <AgentsSearchBar 
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
              />
              
              {loading ? (
                <div className="py-8 text-center text-gray-500">
                  Loading available agents...
                </div>
              ) : (
                <MarketplaceAgentsList 
                  agents={availableAgents}
                  searchQuery={searchQuery}
                  onDeployAgent={handleDeployAgent}
                  deployingAgent={deployingAgent}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Access Denied Dialog */}
      <AlertDialog open={showAccessDeniedDialog} onOpenChange={setShowAccessDeniedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Access Restricted
            </AlertDialogTitle>
            <AlertDialogDescription>
              You don't have permission to deploy or use {deniedAgentName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 bg-amber-50 rounded-md">
            <p className="text-sm text-amber-800">
              This agent requires special permission. Please contact your administrator to request access.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AgentsPage;
