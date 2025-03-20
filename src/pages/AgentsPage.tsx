
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

// Mock agents for immediate rendering with more options
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
  },
  {
    id: 7,
    name: "Predictive Maintenance AI",
    description: "Predicts equipment failures before they occur",
    status: "active" as const,
    confidence: 95,
    icon: "tool"
  },
  {
    id: 8,
    name: "Quality Control Monitor",
    description: "Analyzes product quality and identifies improvement areas",
    status: "active" as const,
    confidence: 93,
    icon: "check-circle"
  },
  {
    id: 9,
    name: "Market Trend Analyzer",
    description: "Identifies steel market trends and predicts price movements",
    status: "active" as const,
    confidence: 88,
    icon: "trending-up"
  },
  {
    id: 10,
    name: "Carbon Footprint Tracker",
    description: "Monitors carbon emissions and suggests reduction strategies",
    status: "active" as const,
    confidence: 90,
    icon: "leaf"
  },
  {
    id: 11,
    name: "Logistics Optimization AI",
    description: "Optimizes logistics routes and reduces transportation costs",
    status: "active" as const,
    confidence: 92,
    icon: "map"
  },
  {
    id: 12,
    name: "Inventory Management AI",
    description: "Optimizes inventory levels to reduce costs",
    status: "active" as const,
    confidence: 94,
    icon: "package"
  },
  {
    id: 13,
    name: "Demand Forecasting AI",
    description: "Forecasts customer demand for better production planning",
    status: "active" as const,
    confidence: 91,
    icon: "bar-chart-2"
  },
  {
    id: 14,
    name: "Safety Compliance Monitor",
    description: "Ensures compliance with safety regulations and standards",
    status: "active" as const,
    confidence: 96,
    icon: "shield"
  },
  {
    id: 15,
    name: "Employee Performance Optimizer",
    description: "Analyzes worker productivity and suggests improvements",
    status: "active" as const,
    confidence: 88,
    icon: "users"
  },
  {
    id: 16,
    name: "Equipment Efficiency Analyzer",
    description: "Monitors equipment performance and suggests optimizations",
    status: "active" as const,
    confidence: 93,
    icon: "settings"
  }
];

const AgentsPage = () => {
  const [availableAgents, setAvailableAgents] = useState(mockAvailableAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { agents, refreshAgents } = useAgents();

  // Filter user agents immediately for better UX
  const filteredAvailableAgents = useMemo(() => {
    const userAgentIds = agents.map(agent => agent.id);
    return mockAvailableAgents.filter(agent => !userAgentIds.includes(agent.id));
  }, [agents]);

  // Set initial state immediately
  useEffect(() => {
    setAvailableAgents(filteredAvailableAgents);
    // Fetch real data in background
    fetchMarketplaceAgents();
  }, [filteredAvailableAgents]);

  const fetchMarketplaceAgents = async () => {
    try {
      const data = await getAvailableAgents();
      
      // If we got actual data from the API, filter out agents that are already added
      const userAgentIds = agents.map(agent => agent.id);
      const filtered = (data as any[]).filter(agent => !userAgentIds.includes(agent.id));
      
      // Only update if we have real data
      if (filtered && filtered.length > 0) {
        setAvailableAgents(filtered);
      }
    } catch (error) {
      console.error('Error fetching marketplace agents:', error);
      // Already showing mock data, no need to handle error
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
