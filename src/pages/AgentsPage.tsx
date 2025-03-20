
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Plus, Search, Filter, BrainCog, Download, ArrowUpDown, Sparkles } from 'lucide-react';
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

const AgentsPage = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
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
      const data = await getAiAgents();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching AI agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI agents. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketplaceAgents = async () => {
    try {
      const data = await getAvailableAgents();
      setAvailableAgents(data);
    } catch (error) {
      console.error('Error fetching marketplace agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available agents. Please try again later.",
        variant: "destructive"
      });
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
      
      // Refresh the lists
      await fetchAgents();
      await fetchMarketplaceAgents();
      
      // Navigate to the agent page
      navigate(`/agent/${agentId}`);
      setShowMarketplace(false);
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

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {availableAgents.length > 0 ? (
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
                      status="available"
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
              <div className="bg-white/10 rounded-lg p-6 text-center mt-4">
                <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-white/50" />
                <h4 className="text-lg font-medium mb-2">All Agents Deployed</h4>
                <p className="text-white/70">
                  You've already deployed all available AI agents to your workspace.
                </p>
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
