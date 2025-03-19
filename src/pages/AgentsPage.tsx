
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit,
  Brain,
  Plus,
  Search,
  Sliders,
  BarChart3,
  Zap,
  Shield,
  Check,
  Trash2,
  Settings,
  PowerOff,
  ArrowLeft,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAiAgents } from '@/services/dataService';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: number;
  name: string;
  description: string;
  status: string;
  confidence: number;
  icon: string;
}

const agentTemplates = [
  {
    name: "Production Anomaly Detector",
    description: "Identifies abnormal patterns in steel production data and suggests corrective actions",
    icon: "bar-chart"
  },
  {
    name: "Energy Efficiency Optimizer",
    description: "Analyzes energy consumption patterns to recommend efficiency improvements",
    icon: "zap"
  },
  {
    name: "Quality Predictor",
    description: "Predicts potential quality issues before they affect the finished product",
    icon: "check-circle"
  },
  {
    name: "Supply Chain Risk Monitor",
    description: "Continuously monitors for disruptions in your steel supply chain",
    icon: "shield"
  }
];

const AgentsPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addAgentOpen, setAddAgentOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const { toast } = useToast();
  
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
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddAgent = () => {
    if (selectedTemplate === null) return;
    
    const template = agentTemplates[selectedTemplate];
    toast({
      title: "Agent deployment initiated",
      description: `${template.name} is being set up. This may take a few moments.`,
    });
    
    // Simulate API call delay
    setTimeout(() => {
      setAddAgentOpen(false);
      setSelectedTemplate(null);
      toast({
        title: "Agent deployed successfully",
        description: `${template.name} is now ready to use.`,
      });
      fetchAgents();
    }, 2000);
  };
  
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchTerm === '' || 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck': return <Zap size={40} className="text-white" />;
      case 'bar-chart': return <BarChart3 size={40} className="text-white" />;
      case 'zap': return <Zap size={40} className="text-white" />;
      case 'check-circle': return <Check size={40} className="text-white" />;
      case 'shield': return <Shield size={40} className="text-white" />;
      default: return <BrainCircuit size={40} className="text-white" />;
    }
  };
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      <div data-main-content className="ml-64 p-8">
        <Header pageTitle="AI Agents Management" />
        
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Agent Management</h1>
                <p className="text-white/80">Deploy, monitor, and manage your specialized steel industry AI agents</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setAddAgentOpen(true)}
              className="bg-white text-purple-700 hover:bg-white/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Agent
            </Button>
          </div>
        </motion.div>
        
        <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="text" 
                placeholder="Search agents..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <Badge 
                variant="outline" 
                className={`cursor-pointer ${statusFilter === 'all' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100'}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer ${statusFilter === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100'}`}
                onClick={() => setStatusFilter('active')}
              >
                Active
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer ${statusFilter === 'inactive' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100'}`}
                onClick={() => setStatusFilter('inactive')}
              >
                Inactive
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer ${statusFilter === 'learning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-gray-100'}`}
                onClick={() => setStatusFilter('learning')}
              >
                Learning
              </Badge>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <>
              {filteredAgents.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="space-y-4">
                    {filteredAgents.map((agent) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className={`h-16 w-16 rounded-full ${
                            agent.status === 'active' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 
                            agent.status === 'learning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-gray-500 to-gray-600'
                          } flex items-center justify-center mr-4 shadow-md`}>
                            {getAgentIcon(agent.icon)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="font-medium text-lg">{agent.name}</h3>
                              <div className={`ml-3 px-2 py-0.5 text-xs font-semibold rounded-full flex items-center ${
                                agent.status === 'active' ? 'bg-green-100 text-green-800' : 
                                agent.status === 'learning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                  agent.status === 'active' ? 'bg-green-500' : 
                                  agent.status === 'learning' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                } animate-pulse`}></span>
                                {agent.status === 'active' ? 'Active' : 
                                  agent.status === 'learning' ? 'Learning' : 'Inactive'}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 mb-3">{agent.description}</p>
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="mr-6">
                                <span className="font-medium">Confidence:</span> {agent.confidence}%
                              </div>
                              <div>
                                <span className="font-medium">Last Active:</span> Today, 12:45 PM
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Link to={`/agent/${agent.id}`}>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                Chat with Agent
                              </Button>
                            </Link>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Sliders className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  <span>Configure</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  <span>Export Data</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <PowerOff className="h-4 w-4 mr-2" />
                                  <span>{agent.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <BrainCircuit className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No agents found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your filter or add a new agent</p>
                  <Button 
                    onClick={() => setAddAgentOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Agent
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        
        <Dialog open={addAgentOpen} onOpenChange={setAddAgentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New AI Agent</DialogTitle>
              <DialogDescription>
                Select an agent template to deploy to your steel ecosystem
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 my-4">
              {agentTemplates.map((template, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedTemplate === index
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedTemplate(index)}
                >
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    {getAgentIcon(template.icon)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-gray-500">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setAddAgentOpen(false);
                setSelectedTemplate(null);
              }}>Cancel</Button>
              <Button 
                onClick={handleAddAgent}
                disabled={selectedTemplate === null}
              >Deploy Agent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AgentsPage;
