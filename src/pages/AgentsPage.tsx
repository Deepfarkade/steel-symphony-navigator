
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

const AgentsPage = () => {
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { agents, refreshAgents } = useAgents();

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
    </div>
  );
};

export default AgentsPage;
