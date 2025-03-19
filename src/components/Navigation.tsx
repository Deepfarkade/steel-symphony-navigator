
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Box, 
  Calendar, 
  ClipboardList, 
  Database, 
  Factory, 
  Home, 
  Orbit, 
  Package, 
  Settings, 
  Truck, 
  AlertTriangle,
  LogOut,
  User,
  BrainCog,
  Brain,
  ChevronDown,
  ChevronRight,
  Plus,
  Lock,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Tool,
  Users
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAiAgents, getAvailableAgents, addAgentToUser } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface NavigationProps {
  agentId?: number;
}

const modules = [
  { 
    name: 'Home', 
    icon: <Home className="h-5 w-5" />, 
    path: '/'
  },
  { 
    name: 'Demand Planning', 
    icon: <BarChart3 className="h-5 w-5" />, 
    path: '/demand-planning'
  },
  { 
    name: 'Supply Planning', 
    icon: <Orbit className="h-5 w-5" />, 
    path: '/supply-planning'
  },
  { 
    name: 'Order Promising', 
    icon: <ClipboardList className="h-5 w-5" />, 
    path: '/order-promising'
  },
  { 
    name: 'Factory Planning', 
    icon: <Factory className="h-5 w-5" />, 
    path: '/factory-planning'
  },
  { 
    name: 'Inventory Optimization', 
    icon: <Package className="h-5 w-5" />, 
    path: '/inventory-optimization'
  },
  { 
    name: 'Inventory Liquidation', 
    icon: <Box className="h-5 w-5" />, 
    path: '/inventory-liquidation'
  },
  { 
    name: 'Logistics Management', 
    icon: <Truck className="h-5 w-5" />, 
    path: '/logistics'
  },
  { 
    name: 'Risk Management', 
    icon: <AlertTriangle className="h-5 w-5" />, 
    path: '/risk-management'
  },
  { 
    name: 'Analytics & Reporting', 
    icon: <Database className="h-5 w-5" />, 
    path: '/analytics'
  },
  {
    name: 'News & Updates',
    icon: <Calendar className="h-5 w-5" />,
    path: '/news'
  }
];

interface Agent {
  id: number;
  name: string;
  status: string;
  icon: string;
  description?: string;
  confidence?: number;
}

const Navigation: React.FC<NavigationProps> = ({ agentId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Select the main content container that needs to be adjusted
    const mainContent = document.querySelector('[data-main-content]');
    if (mainContent) {
      // Adjust margin based on sidebar state
      if (isExpanded) {
        mainContent.classList.remove('ml-20');
        mainContent.classList.add('ml-64');
      } else {
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-20');
      }
    }
  }, [isExpanded]);

  useEffect(() => {
    // If we're on an agent page, expand the agents section
    if (agentId || location.pathname.includes('/agent/')) {
      setIsAgentsOpen(true);
      fetchAgents();
    }
  }, [agentId, location.pathname]);

  const fetchAgents = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const data = await getAiAgents();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching AI agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAgents = async () => {
    try {
      const data = await getAvailableAgents();
      setAvailableAgents(data);
    } catch (error) {
      console.error('Error fetching available agents:', error);
    }
  };

  const handleMarketplaceOpen = () => {
    setShowMarketplace(true);
    fetchAvailableAgents();
  };

  const addAgent = async (agentId: number) => {
    try {
      await addAgentToUser(agentId);
      toast({
        title: "Agent added successfully",
        description: "The agent has been added to your workspace and is now available.",
      });
      fetchAgents(); // Refresh the agents list
      setShowMarketplace(false);
    } catch (error) {
      console.error('Error adding agent:', error);
      toast({
        variant: "destructive",
        title: "Failed to add agent",
        description: "Please try again later.",
      });
    }
  };

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck': return <Truck className="h-4 w-4" />;
      case 'bar-chart': return <BarChart3 className="h-4 w-4" />;
      case 'bar-chart-2': return <BarChart2 className="h-4 w-4" />;
      case 'zap': return <Brain className="h-4 w-4" />;
      case 'check-circle': return <Box className="h-4 w-4" />;
      case 'shield': return <AlertTriangle className="h-4 w-4" />;
      case 'trending-up': return <TrendingUp className="h-4 w-4" />;
      case 'tool': return <Tool className="h-4 w-4" />;
      case 'package': return <Package className="h-4 w-4" />;
      case 'users': return <Users className="h-4 w-4" />;
      default: return <BrainCog className="h-4 w-4" />;
    }
  };

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-ey-lightGray/20 shadow-sm`}>
      <div className="h-full px-3 py-8 flex flex-col justify-between">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            {isExpanded ? (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-ey-yellow rounded-md flex items-center justify-center font-bold text-black">EY</div>
                <span className="ml-2 text-lg font-semibold">SECP</span>
              </div>
            ) : (
              <div className="w-10 h-10 bg-ey-yellow rounded-md flex items-center justify-center font-bold text-black">EY</div>
            )}
          </div>
          
          {/* User info when expanded */}
          {isExpanded && user && (
            <div className="px-4 py-3 mb-6 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-ey-yellow/30 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-ey-darkGray" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-ey-darkGray truncate">{user.name}</p>
                  <p className="text-xs text-ey-lightGray truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Nav links */}
          <ScrollArea className="flex-grow pr-3">
            <div className="space-y-2">
              {modules.map((module) => (
                <Link 
                  key={module.name}
                  to={module.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                    location.pathname === module.path 
                      ? 'bg-ey-yellow/20 text-ey-darkGray' 
                      : 'text-ey-darkGray/70 hover:bg-ey-yellow/10'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {module.icon}
                  </div>
                  {isExpanded && (
                    <span className="ml-3 whitespace-nowrap">{module.name}</span>
                  )}
                  {!isExpanded && location.pathname === module.path && (
                    <div className="absolute left-0 w-1 h-8 bg-ey-yellow rounded-r-full"></div>
                  )}
                </Link>
              ))}
              
              {/* Your Agents section */}
              <Collapsible
                open={isAgentsOpen}
                onOpenChange={(open) => {
                  setIsAgentsOpen(open);
                  if (open) fetchAgents();
                }}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <button className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    isAgentsOpen ? 'bg-purple-100 text-purple-700' : 'text-ey-darkGray/70 hover:bg-ey-yellow/10'
                  }`}>
                    <div className="flex items-center">
                      <BrainCog className="h-5 w-5" />
                      {isExpanded && <span className="ml-3 whitespace-nowrap">Your Agents</span>}
                    </div>
                    {isExpanded && (
                      isAgentsOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )
                    )}
                  </button>
                </CollapsibleTrigger>
                
                {isExpanded && (
                  <CollapsibleContent className="ml-2 space-y-1">
                    <ScrollArea className="max-h-60">
                      {loading ? (
                        <div className="animate-pulse p-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-9 bg-gray-100 rounded-md mb-2"></div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {agents.map(agent => (
                            <Link
                              key={agent.id}
                              to={`/agent/${agent.id}`}
                              className={`flex items-center p-2 rounded-md text-sm ${
                                agentId === agent.id
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'text-ey-darkGray/70 hover:bg-gray-100'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full ${
                                agent.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                              } flex items-center justify-center mr-2`}>
                                {getAgentIcon(agent.icon)}
                              </div>
                              <span className="truncate">{agent.name}</span>
                              {agent.status === 'active' && (
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 ml-2 animate-pulse"></div>
                              )}
                            </Link>
                          ))}
                          
                          <button
                            onClick={handleMarketplaceOpen}
                            className="flex items-center w-full p-2 rounded-md text-sm text-purple-600 hover:bg-purple-50"
                          >
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                              <Plus className="h-3.5 w-3.5" />
                            </div>
                            <span>Add More Agents</span>
                          </button>
                        </>
                      )}
                    </ScrollArea>
                  </CollapsibleContent>
                )}
              </Collapsible>
            </div>
          </ScrollArea>
        </div>
        
        {/* Bottom section */}
        <div>
          {isExpanded ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hover:bg-ey-yellow/10 text-ey-darkGray/70">
                      <Settings className="h-5 w-5 mr-2" />
                      <span>Settings</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Preferences</DropdownMenuItem>
                    <DropdownMenuItem>Notifications</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center p-3 rounded-lg bg-ey-darkGray/5 text-ey-darkGray hover:bg-ey-darkGray/10 transition-all duration-300"
              >
                {'<<'}
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center space-y-4 mb-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-ey-yellow/10 text-ey-darkGray/70"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-ey-yellow/10 text-red-500"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center p-3 rounded-lg bg-ey-darkGray/5 text-ey-darkGray hover:bg-ey-darkGray/10 transition-all duration-300"
              >
                {'>>'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Agent Marketplace Dialog */}
      <Dialog open={showMarketplace} onOpenChange={setShowMarketplace}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <BrainCog className="h-5 w-5 mr-2 text-purple-500" />
              AI Agent Marketplace
            </DialogTitle>
            <DialogDescription>
              Discover and add specialized AI agents to enhance your steel operations.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableAgents.map((agent) => (
                <div 
                  key={agent.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3`}>
                        {getAgentIcon(agent.icon)}
                      </div>
                      <div>
                        <h3 className="font-medium text-ey-darkGray">{agent.name}</h3>
                        <p className="text-sm text-ey-lightGray">{agent.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full mb-2">
                        {agent.confidence}% Confidence
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => addAgent(agent.id)}
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Agent
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default Navigation;
