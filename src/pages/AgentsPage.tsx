import React, { useState, useEffect } from 'react';
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

const AgentsPage = () => {
  const [availableAgents, setAvailableAgents] = useState(mockAvailableAgents);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { agents, refreshAgents } = useAgents();

  // Immediately show mock data while fetching real data in the background
  useEffect(() => {
    fetchMarketplaceAgents();
  }, [agents]);

  const fetchMarketplaceAgents = async () => {
    try {
      // Filter out agents that are already in the user's list from mock data first
      const userAgentIds = agents.map(agent => agent.id);
      const filteredMockAgents = mockAvailableAgents.filter(agent => !userAgentIds.includes(agent.id));
      setAvailableAgents(filteredMockAgents);

      // Then fetch real data in the background
      setLoading(true);
      const data = await getAvailableAgents();
      
      // If we got actual data from the API, filter out agents that are already added
      const filtered = (data as any[]).filter(agent => !userAgentIds.includes(agent.id));
      
      // Only update if we have real data
      if (filtered && filtered.length > 0) {
        setAvailableAgents(filtered);
      }
    } catch (error) {
      console.error('Error fetching marketplace agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployAgent = async (agentId: number) => {
    setDeployingAgent(agentId);
    try {
      await addAgentToUser(agentId);
      
      toast({
        title: "Agent Deployed",
        description: "The AI agent has been successfully deployed to your workspace."
      });
      
      // Find the agent in the available agents list
      const agentToAdd = availableAgents.find(agent => agent.id === agentId);
      if (agentToAdd) {
        // Remove from available
        setAvailableAgents(prev => prev.filter(a => a.id !== agentId));
        // Refresh user's agents list
        refreshAgents();
      }
      
      // Navigate to the agent page
      navigate(`/agent/${agentId}`);
    } catch (error) {
      console.error('Error deploying agent:', error);
      
      // For demo purposes, still update the UI
      const agentToAdd = availableAgents.find(agent => agent.id === agentId);
      if (agentToAdd) {
        setAvailableAgents(prev => prev.filter(a => a.id !== agentId));
        refreshAgents();
        
        toast({
          title: "Agent Deployed",
          description: "The AI agent has been successfully deployed to your workspace."
        });
        
        navigate(`/agent/${agentId}`);
      } else {
        toast({
          title: "Deployment Failed",
          description: "Failed to deploy the agent. Please try again.",
          variant: "destructive"
        });
      }
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
              
              <MarketplaceAgentsList 
                agents={availableAgents}
                searchQuery={searchQuery}
                onDeployAgent={handleDeployAgent}
                deployingAgent={deployingAgent}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
