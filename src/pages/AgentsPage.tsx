
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Plus, Search, Filter, BrainCog, Download, ArrowUpDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import AiAgentCard from '../components/AiAgentCard';
import { getAiAgents } from '@/services/dataService';
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  const [selectedAgentTemplate, setSelectedAgentTemplate] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const agentTemplates = [
    { id: 1, name: 'Supply Chain Analyzer', description: 'Analyzes your steel supply chain for inefficiencies and risks', icon: 'truck' },
    { id: 2, name: 'Production Optimizer', description: 'Optimizes steel production schedules and resource allocation', icon: 'factory' },
    { id: 3, name: 'Quality Inspector', description: 'Detects quality issues in steel production and suggests improvements', icon: 'check-circle' },
    { id: 4, name: 'Demand Forecaster', description: 'Predicts future steel demand based on historical data and market trends', icon: 'bar-chart' },
  ];

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAgent = () => {
    if (!selectedAgentTemplate) {
      toast({
        title: "Select a template",
        description: "Please select an agent template to continue."
      });
      return;
    }

    // Simulate agent creation
    setShowNewAgentDialog(false);
    toast({
      title: "Agent Created",
      description: "Your new AI agent is being deployed. This may take a few minutes."
    });

    // Simulate loading time
    setTimeout(() => {
      toast({
        title: "Agent Deployed",
        description: "Your new AI agent is now active and ready to use!"
      });
      fetchAgents();
    }, 2000);
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
                    onClick={() => setShowNewAgentDialog(true)}
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
                      onClick={() => setShowNewAgentDialog(true)}
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
      
      <Dialog open={showNewAgentDialog} onOpenChange={setShowNewAgentDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Deploy a New AI Agent</DialogTitle>
            <DialogDescription>
              Choose an agent template to deploy to your steel ecosystem.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {agentTemplates.map((template) => (
                <div 
                  key={template.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAgentTemplate === template.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedAgentTemplate(template.id)}
                >
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <BrainCircuit className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-ey-lightGray">{template.description}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAgentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAgent}>
              Deploy Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentsPage;
