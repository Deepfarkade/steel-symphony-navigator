
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Plus, Search, Filter, BrainCog, Download, ArrowUpDown, Sparkles, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import AiAgentCard from '../components/AiAgentCard';
import { getAiAgents, getAvailableAgents, addAgentToUser } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

  const filteredAgents = availableAgents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <BrainCircuit className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">EY Steel Ecosystem AI Agents</CardTitle>
                    <CardDescription className="text-white/80">
                      Deploy specialized AI agents to continuously analyze your steel operations
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  className="bg-indigo-500 hover:bg-indigo-600 text-white"
                  onClick={() => navigate('/create-agent')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Custom Agent
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    placeholder="Search marketplace..." 
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="text-ey-darkGray">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="text-ey-darkGray">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>
              
              {filteredAgents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAgents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg overflow-hidden border border-white/10"
                    >
                      <AiAgentCard
                        id={agent.id}
                        name={agent.name}
                        description={agent.description}
                        status="active"
                        confidence={agent.confidence}
                        icon={agent.icon}
                        onActivate={handleDeployAgent}
                        isExpanded={true}
                        deploying={deployingAgent === agent.id}
                        isUserAgent={false}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BrainCog className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-ey-darkGray mb-2">No agents found</h3>
                  <p className="text-ey-lightGray mb-6">
                    {searchQuery ? 'No agents match your search criteria.' : 'All available agents have already been deployed.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
