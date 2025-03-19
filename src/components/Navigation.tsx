
import React, { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Newspaper
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getActiveAiAgents } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";

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
    name: 'Industry News',
    icon: <Newspaper className="h-5 w-5" />,
    path: '/news'
  }
];

const Navigation = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [agentsExpanded, setAgentsExpanded] = useState(false);
  const [activeAgents, setActiveAgents] = useState<any[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const agentsScrollRef = useRef<HTMLDivElement>(null);

  // Load active agents
  useEffect(() => {
    const fetchActiveAgents = async () => {
      try {
        const agents = await getActiveAiAgents();
        setActiveAgents(agents);
      } catch (error) {
        console.error('Error fetching active agents:', error);
      } finally {
        setLoadingAgents(false);
      }
    };

    fetchActiveAgents();
  }, []);

  // Add effect to adjust main content area when sidebar collapses/expands
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

  const handleAgentClick = (agentId: number, agentName: string) => {
    toast({
      title: `${agentName} activated`,
      description: "The agent is now ready to assist you. Start a conversation in the chat window.",
    });
    // Navigate to chat with the specific agent
    window.location.href = `/chat/agent/${agentId}`;
  };

  const handleAddAgent = () => {
    toast({
      title: "Deploy more agents",
      description: "Opening the AI Agents deployment center.",
    });
    window.location.href = "/";
  };

  // Modules section with scrolling
  const renderModules = () => (
    <ScrollArea className="flex-1 py-2">
      <div className="space-y-2 pr-2">
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
      </div>
    </ScrollArea>
  );

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-ey-lightGray/20 shadow-sm flex flex-col`}>
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
          
          {/* Nav links with scroll area */}
          {renderModules()}
        </div>
        
        {/* Bottom section with Your Agents */}
        <div className="space-y-4 mt-4">
          {/* Your Agents section */}
          {isExpanded && (
            <Collapsible
              open={agentsExpanded}
              onOpenChange={setAgentsExpanded}
              className="rounded-lg border border-gray-200"
            >
              <CollapsibleTrigger className="w-full p-3 flex items-center justify-between text-ey-darkGray hover:bg-gray-50 rounded-t-lg transition-colors">
                <div className="flex items-center">
                  <BrainCog className="h-5 w-5 mr-2 text-purple-600" />
                  <span className="font-medium">Your Agents</span>
                </div>
                {agentsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-2 bg-gray-50 rounded-b-lg">
                <ScrollArea className="max-h-48" ref={agentsScrollRef}>
                  <div className="space-y-1 pr-2">
                    {loadingAgents ? (
                      <div className="flex items-center justify-center p-3">
                        <span className="text-sm text-gray-500">Loading agents...</span>
                      </div>
                    ) : activeAgents.length > 0 ? (
                      <>
                        {activeAgents.map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() => handleAgentClick(agent.id, agent.name)}
                            className="w-full flex items-center p-2 rounded-md text-sm text-ey-darkGray hover:bg-purple-100 transition-colors"
                          >
                            <div className="h-7 w-7 bg-purple-200 rounded-full flex items-center justify-center mr-2">
                              <MessageSquare className="h-3.5 w-3.5 text-purple-700" />
                            </div>
                            <span className="truncate">{agent.name}</span>
                          </button>
                        ))}
                        <button
                          onClick={handleAddAgent}
                          className="w-full flex items-center p-2 rounded-md text-sm text-ey-darkGray hover:bg-purple-100 transition-colors mt-2 border border-dashed border-purple-300"
                        >
                          <PlusCircle className="h-4 w-4 mr-2 text-purple-600" />
                          <span>Add more agents</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-center">
                        <span className="text-sm text-gray-500 mb-2">No active agents</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleAddAgent}
                          className="text-xs bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                        >
                          <PlusCircle className="h-3.5 w-3.5 mr-1" /> 
                          Deploy Agents
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          )}

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
                  className="hover:bg-ey-yellow/10 text-ey-darkGray/70"
                  title="Your AI Agents"
                >
                  <BrainCog className="h-5 w-5 text-purple-600" />
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
    </aside>
  );
};

export default Navigation;
