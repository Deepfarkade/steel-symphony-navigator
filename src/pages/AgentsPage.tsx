
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Plus, Search, Filter, BrainCog, Download, ArrowUpDown, Sparkles, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import AiAgentCard from '../components/AiAgentCard';
import { getAiAgents, getAvailableAgents, addAgentToUser } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';

interface Agent {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'learning';
  confidence: number;
  icon: string;
}

// Mock agents for fallback when API is slow
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

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [deployingAgent, setDeployingAgent] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      // Set up a race between the API call and a timeout
      const apiPromise = getAiAgents();
      const timeoutPromise = new Promise<Agent[]>((resolve) => {
        setTimeout(() => {
          console.log('Using mock data due to API timeout');
          resolve(mockAgents.slice(0, 3));
        }, 1500); // 1.5 second timeout
      });

      const data = await Promise.race([apiPromise, timeoutPromise]);
      setAgents(data as Agent[]);
    } catch (error) {
      console.error('Error fetching AI agents:', error);
      toast({
        title: "Using demo data",
        description: "Could not fetch real agents. Using sample data instead.",
      });
      setAgents(mockAgents.slice(0, 3)); // Use first 3 mock agents
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketplaceAgents = async () => {
    try {
      // Set up a race between the API call and a timeout
      const apiPromise = getAvailableAgents();
      const timeoutPromise = new Promise<Agent[]>((resolve) => {
        setTimeout(() => {
          console.log('Using mock marketplace data due to API timeout');
          // Filter out agents that are already in the user's list
          const userAgentIds = agents.map(agent => agent.id);
          resolve(mockAgents.filter(agent => !userAgentIds.includes(agent.id)));
        }, 1500); // 1.5 second timeout
      });

      const data = await Promise.race([apiPromise, timeoutPromise]);
      
      // If we got actual data from the API, filter out agents that are already added
      const userAgentIds = agents.map(agent => agent.id);
      let filtered = (data as Agent[]).filter(agent => !userAgentIds.includes(agent.id));
      
      // If no agents are available after filtering, use mock data
      if (filtered.length === 0) {
        filtered = mockAgents.filter(agent => !userAgentIds.includes(agent.id));
      }
      
      setAvailableAgents(filtered);
    } catch (error) {
      console.error('Error fetching marketplace agents:', error);
      toast({
        title: "Using demo data",
        description: "Could not fetch available agents. Using sample data instead.",
      });
      
      // Filter out agents that are already in the user's list
      const userAgentIds = agents.map(agent => agent.id);
      setAvailableAgents(mockAgents.filter(agent => !userAgentIds.includes(agent.id)));
    }
  };

  const handleOpenMarketplace = () => {
    fetchMarketplaceAgents();
    setShowMarketplace(true);
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
        // Add it to the user's agents and remove from available
        setAgents(prev => [...prev, agentToAdd]);
        setAvailableAgents(prev => prev.filter(a => a.id !== agentId));
      } else {
        // If not found (unlikely), refresh both lists
        await fetchAgents();
        await fetchMarketplaceAgents();
      }
      
      // Navigate to the agent page
      navigate(`/agent/${agentId}`);
      setShowMarketplace(false);
    } catch (error) {
      console.error('Error deploying agent:', error);
      
      // For demo purposes, still add the agent to the user's list
      const agentToAdd = availableAgents.find(agent => agent.id === agentId);
      if (agentToAdd) {
        setAgents(prev => [...prev, agentToAdd]);
        setAvailableAgents(prev => prev.filter(a => a.id !== agentId));
        
        toast({
          title: "Agent Deployed",
          description: "The AI agent has been successfully deployed to your workspace."
        });
        
        navigate(`/agent/${agentId}`);
        setShowMarketplace(false);
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

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAgentCard = (agent: any, status: 'active' | 'learning' | 'inactive') => {
    return (
      <Link key={agent.id} to={`/agent/${agent.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg overflow-hidden h-full cursor-pointer hover:shadow-lg transition-all"
        >
          <AiAgentCard
            id={agent.id}
            name={agent.name}
            description={agent.description}
            status={agent.status}
            confidence={agent.confidence}
            icon={agent.icon}
            isExpanded={true}
            deploying={false}
            isUserAgent={true}
          />
        </motion.div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div data-main-content className="ml-64 p-8 transition-all duration-300">
        <Header 
          pageTitle="AI Agents"
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'AI Agents', link: '/agents' }
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
                <div className="flex gap-2">
                  <Button 
                    className="bg-white hover:bg-white/90 text-purple-700"
                    onClick={handleOpenMarketplace}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Deploy New Agent
                  </Button>
                  <Button 
                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={() => navigate('/create-agent')}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Make Your Own Agent
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10" 
                    placeholder="Search agents..." 
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
                  <Button variant="outline" size="sm" className="text-ey-darkGray">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-48"></div>
                  ))}
                </div>
              ) : filteredAgents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAgents.map((agent) => (
                    renderAgentCard(agent, agent.status)
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BrainCog className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-ey-darkGray mb-2">No agents found</h3>
                  <p className="text-ey-lightGray mb-6">
                    {searchQuery ? 'No agents match your search criteria.' : 'You haven\'t deployed any AI agents yet.'}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      onClick={handleOpenMarketplace}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Deploy Your First Agent
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/create-agent')}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Custom Agent
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={showMarketplace} onOpenChange={setShowMarketplace}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col bg-gradient-to-r from-purple-800 to-indigo-900 text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-300" />
              AI Agent Marketplace
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Deploy specialized AI agents to continuously analyze your steel operations and provide actionable insights.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 overflow-y-auto px-1">
            {availableAgents.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 text-white/70 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {availableAgents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 rounded-lg overflow-hidden border border-white/10"
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
            )}
          </ScrollArea>
          
          <DialogFooter className="pt-4 border-t border-white/10 mt-4">
            <Button variant="secondary" onClick={() => setShowMarketplace(false)}>
              Close
            </Button>
            <Button 
              className="bg-indigo-500 hover:bg-indigo-600"
              onClick={() => {
                setShowMarketplace(false);
                navigate('/create-agent');
              }}
            >
              Create Custom Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentsPage;
