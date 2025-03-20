
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  FolderClosed,
  FolderOpen,
  LayoutDashboard,
  Sparkles,
  Zap,
  Settings2,
  Gauge,
  UserRound
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAiAgents, getAvailableAgents, addAgentToUser, removeAgentFromUser } from '@/services/dataService';
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
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface NavigationProps {
  agentId?: number;
}

// Group the modules for better organization
const moduleGroups = [
  {
    name: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: '/',
    standalone: true
  },
  {
    name: 'Supply Chain Modules',
    icon: <FolderClosed className="h-5 w-5" />,
    iconOpen: <FolderOpen className="h-5 w-5" />,
    modules: [
      { 
        name: 'Demand Planning', 
        icon: <BarChart3 className="h-4 w-4" />, 
        path: '/demand-planning'
      },
      { 
        name: 'Supply Planning', 
        icon: <Orbit className="h-4 w-4" />, 
        path: '/supply-planning'
      },
      { 
        name: 'Order Promising', 
        icon: <ClipboardList className="h-4 w-4" />, 
        path: '/order-promising'
      },
      { 
        name: 'Factory Planning', 
        icon: <Factory className="h-4 w-4" />, 
        path: '/factory-planning'
      },
      { 
        name: 'Inventory Optimization', 
        icon: <Package className="h-4 w-4" />, 
        path: '/inventory-optimization'
      },
      { 
        name: 'Inventory Liquidation', 
        icon: <Box className="h-4 w-4" />, 
        path: '/inventory-liquidation'
      },
      { 
        name: 'Logistics Management', 
        icon: <Truck className="h-4 w-4" />, 
        path: '/logistics'
      }
    ]
  },
  {
    name: 'Risk & Analytics',
    icon: <Gauge className="h-5 w-5" />,
    iconOpen: <Gauge className="h-5 w-5" />,
    modules: [
      { 
        name: 'Risk Management', 
        icon: <AlertTriangle className="h-4 w-4" />, 
        path: '/risk-management'
      },
      { 
        name: 'Analytics & Reporting', 
        icon: <Database className="h-4 w-4" />, 
        path: '/analytics'
      },
      {
        name: 'News & Updates',
        icon: <Calendar className="h-4 w-4" />,
        path: '/news'
      }
    ]
  }
];

interface Agent {
  id: number;
  name: string;
  status: 'active' | 'inactive' | 'learning';
  icon: string;
  description?: string;
  confidence?: number;
}

// Mock agents data for immediate rendering
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

const Navigation: React.FC<NavigationProps> = ({ agentId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    'Supply Chain Modules': false,
    'Risk & Analytics': false
  });
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingAgent, setAddingAgent] = useState<number | null>(null);
  const [removingAgent, setRemovingAgent] = useState<number | null>(null);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedAgentToRemove, setSelectedAgentToRemove] = useState<Agent | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Set initial state of open sections based on current route
  useEffect(() => {
    // Open Supply Chain Modules if current route matches any of its paths
    const isSupplyChainRoute = moduleGroups[1].modules.some(
      module => location.pathname === module.path
    );
    if (isSupplyChainRoute) {
      setOpenGroups(prev => ({ ...prev, 'Supply Chain Modules': true }));
    }

    // Open Risk & Analytics if current route matches any of its paths
    const isRiskAnalyticsRoute = moduleGroups[2].modules.some(
      module => location.pathname === module.path
    );
    if (isRiskAnalyticsRoute) {
      setOpenGroups(prev => ({ ...prev, 'Risk & Analytics': true }));
    }
  }, []);

  useEffect(() => {
    const mainContent = document.querySelector('[data-main-content]');
    if (mainContent) {
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
    if (agentId || location.pathname.includes('/agent/')) {
      setIsAgentsOpen(true);
    }
    
    // Always fetch agents when the component mounts
    fetchAgents();
  }, [agentId, location.pathname]);

  const fetchAgents = async () => {
    if (loading) return;
    
    // Immediately set mock agents for fast UI rendering
    setAgents(mockAgents.slice(0, 3));
    
    try {
      setLoading(true);
      const data = await getAiAgents();
      // If we got data, update with real agents
      if (data && Array.isArray(data) && data.length > 0) {
        setAgents(data as Agent[]);
      }
    } catch (error) {
      console.error('Error fetching AI agents:', error);
      // Mock data is already set as fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableAgents = async () => {
    // Immediately set mock available agents for fast UI rendering
    setAvailableAgents(mockAgents.slice(3));
    
    try {
      setLoading(true);
      const data = await getAvailableAgents();
      
      // If we got data, update with real agents
      if (data && Array.isArray(data) && data.length > 0) {
        // Filter out agents that are already added
        const agentIds = agents.map(agent => agent.id);
        setAvailableAgents((data as Agent[]).filter(agent => !agentIds.includes(agent.id)));
      }
    } catch (error) {
      console.error('Error fetching available agents:', error);
      toast({
        variant: "destructive",
        title: "Failed to load agents",
        description: "Using demo data instead"
      });
      // Mock data is already set as fallback
    } finally {
      setLoading(false);
    }
  };

  const handleMarketplaceOpen = () => {
    setShowMarketplace(true);
    fetchAvailableAgents();
  };

  const addAgent = async (agentId: number) => {
    try {
      setAddingAgent(agentId);
      await addAgentToUser(agentId);
      
      // Find the agent being added from available agents
      const agentToAdd = availableAgents.find(agent => agent.id === agentId);
      if (agentToAdd) {
        // Update UI immediately for better UX
        setAgents(prev => [...prev, agentToAdd]);
        setAvailableAgents(prev => prev.filter(agent => agent.id !== agentId));
      }
      
      toast({
        title: "Agent added successfully",
        description: "The agent has been added to your workspace and is now available.",
      });
      
      // Close the dialog and navigate to the new agent
      setShowMarketplace(false);
      navigate(`/agent/${agentId}`);
    } catch (error) {
      console.error('Error adding agent:', error);
      
      // Still update UI for demo purposes
      const agentToAdd = availableAgents.find(agent => agent.id === agentId);
      if (agentToAdd) {
        setAgents(prev => [...prev, agentToAdd]);
        setAvailableAgents(prev => prev.filter(agent => agent.id !== agentId));
        
        toast({
          title: "Agent added successfully",
          description: "The agent has been added to your workspace and is now available.",
        });
        
        setShowMarketplace(false);
        navigate(`/agent/${agentId}`);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add agent",
          description: "Please try again later.",
        });
      }
    } finally {
      setAddingAgent(null);
    }
  };

  const handleRemoveAgent = (agent: Agent, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedAgentToRemove(agent);
    setShowRemoveDialog(true);
  };

  const confirmRemoveAgent = async () => {
    if (!selectedAgentToRemove) return;
    
    try {
      setRemovingAgent(selectedAgentToRemove.id);
      await removeAgentFromUser(selectedAgentToRemove.id);
      
      // Update UI immediately
      setAgents(prev => prev.filter(agent => agent.id !== selectedAgentToRemove.id));
      setAvailableAgents(prev => [...prev, selectedAgentToRemove]);
      
      toast({
        title: "Agent removed",
        description: "The agent has been removed from your workspace.",
      });
      
      // If currently viewing the removed agent, navigate back to agents page
      if (location.pathname === `/agent/${selectedAgentToRemove.id}`) {
        navigate('/agents');
      }
    } catch (error) {
      console.error('Error removing agent:', error);
      
      // Still update UI for demo purposes
      setAgents(prev => prev.filter(agent => agent.id !== selectedAgentToRemove.id));
      
      toast({
        title: "Agent removed",
        description: "The agent has been removed from your workspace.",
      });
    } finally {
      setRemovingAgent(null);
      setShowRemoveDialog(false);
      setSelectedAgentToRemove(null);
    }
  };

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck': return <Truck className="h-4 w-4" />;
      case 'bar-chart': return <BarChart3 className="h-4 w-4" />;
      case 'zap': return <Zap className="h-4 w-4" />;
      case 'check-circle': return <CheckCircle className="h-4 w-4" />;
      case 'shield': return <Shield className="h-4 w-4" />;
      case 'alert-triangle': return <AlertTriangle className="h-4 w-4" />;
      case 'globe': return <Globe className="h-4 w-4" />;
      case 'lightbulb': return <Lightbulb className="h-4 w-4" />;
      default: return <BrainCog className="h-4 w-4" />;
    }
  };

  // Toggle a specific module group
  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Sidebar collapse animation
  const sidebarVariants = {
    expanded: {
      width: "16rem", // 64px in tailwind
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    collapsed: {
      width: "5rem", // 20px in tailwind
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const contentVariants = {
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    hidden: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <TooltipProvider>
      <motion.aside 
        initial="expanded"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 z-40 h-screen bg-white border-r border-ey-lightGray/20 shadow-sm overflow-hidden"
      >
        <div className="h-full px-3 flex flex-col justify-between">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center py-6">
              {isExpanded ? (
                <motion.div 
                  className="flex items-center"
                  initial="visible"
                  animate="visible"
                  variants={contentVariants}
                >
                  <div className="w-10 h-10 bg-ey-yellow rounded-md flex items-center justify-center font-bold text-black">EY</div>
                  <span className="ml-2 text-lg font-semibold">SECP</span>
                </motion.div>
              ) : (
                <motion.div
                  className="w-10 h-10 bg-ey-yellow rounded-md flex items-center justify-center font-bold text-black"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  EY
                </motion.div>
              )}
            </div>
            
            {isExpanded && user && (
              <motion.div 
                className="px-4 py-3 mb-6 bg-gray-50 rounded-lg"
                initial="visible"
                animate="visible"
                variants={contentVariants}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-ey-yellow/30 rounded-full flex items-center justify-center">
                    <UserRound className="h-4 w-4 text-ey-darkGray" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-ey-darkGray truncate">{user.name}</p>
                    <p className="text-xs text-ey-lightGray truncate">{user.email}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="flex-grow overflow-hidden flex flex-col">
              <ScrollArea className="flex-grow pr-3">
                <div className="space-y-2">
                  {/* Dashboard standalone link */}
                  <Link 
                    to="/"
                    className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                      location.pathname === '/' 
                        ? 'bg-ey-yellow/20 text-ey-darkGray' 
                        : 'text-ey-darkGray/70 hover:bg-ey-yellow/10'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <LayoutDashboard className="h-5 w-5" />
                    </div>
                    
                    {isExpanded && (
                      <motion.span 
                        className="ml-3 whitespace-nowrap"
                        initial="visible"
                        animate="visible"
                        variants={contentVariants}
                      >
                        Dashboard
                      </motion.span>
                    )}
                    
                    {!isExpanded && location.pathname === '/' && (
                      <div className="absolute left-0 w-1 h-8 bg-ey-yellow rounded-r-full"></div>
                    )}
                  </Link>
                  
                  {/* Module Groups with collapsible sections */}
                  {moduleGroups.slice(1).map((group) => (
                    <div key={group.name}>
                      {group.standalone ? (
                        // Standalone module link
                        <Link 
                          to={group.path}
                          className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                            location.pathname === group.path 
                              ? 'bg-ey-yellow/20 text-ey-darkGray' 
                              : 'text-ey-darkGray/70 hover:bg-ey-yellow/10'
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {group.icon}
                          </div>
                          
                          {isExpanded && (
                            <motion.span 
                              className="ml-3 whitespace-nowrap"
                              initial="visible"
                              animate="visible"
                              variants={contentVariants}
                            >
                              {group.name}
                            </motion.span>
                          )}
                          
                          {!isExpanded && location.pathname === group.path && (
                            <div className="absolute left-0 w-1 h-8 bg-ey-yellow rounded-r-full"></div>
                          )}
                        </Link>
                      ) : (
                        // Collapsible module group
                        <Collapsible
                          open={openGroups[group.name]}
                          onOpenChange={() => toggleGroup(group.name)}
                          className="w-full"
                        >
                          <CollapsibleTrigger asChild>
                            <button 
                              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                                openGroups[group.name] ? 'bg-ey-yellow/20 text-ey-darkGray' : 'text-ey-darkGray/70 hover:bg-ey-yellow/10'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  {openGroups[group.name] ? (group.iconOpen || group.icon) : group.icon}
                                </div>
                                
                                {isExpanded && (
                                  <motion.span 
                                    className="ml-3 whitespace-nowrap"
                                    initial="visible"
                                    animate="visible"
                                    variants={contentVariants}
                                  >
                                    {group.name}
                                  </motion.span>
                                )}
                              </div>
                              
                              {isExpanded && (
                                <motion.div
                                  initial="visible"
                                  animate="visible"
                                  variants={contentVariants}
                                >
                                  {openGroups[group.name] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </motion.div>
                              )}
                            </button>
                          </CollapsibleTrigger>
                          
                          {isExpanded && (
                            <CollapsibleContent>
                              <div className="ml-2 space-y-1">
                                {group.modules.map((module) => (
                                  <Link
                                    key={module.name}
                                    to={module.path}
                                    className={`flex items-center p-2 rounded-md text-sm ${
                                      location.pathname === module.path
                                        ? 'bg-ey-yellow/20 text-ey-darkGray'
                                        : 'text-ey-darkGray/70 hover:bg-ey-yellow/10'
                                    }`}
                                  >
                                    <div className="w-6 h-6 flex items-center justify-center mr-2">
                                      {module.icon}
                                    </div>
                                    <span className="truncate">{module.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </CollapsibleContent>
                          )}
                          
                          {/* For collapsed state, show tooltips */}
                          {!isExpanded && (
                            <div className="space-y-1 mt-1">
                              {group.modules.map((module) => (
                                <Tooltip key={module.name}>
                                  <TooltipTrigger asChild>
                                    <Link
                                      to={module.path}
                                      className={`flex items-center justify-center p-2 rounded-md ${
                                        location.pathname === module.path
                                          ? 'bg-ey-yellow/20 text-ey-darkGray'
                                          : 'text-ey-darkGray/70 hover:bg-ey-yellow/10'
                                      }`}
                                    >
                                      <div className="w-6 h-6 flex items-center justify-center">
                                        {module.icon}
                                      </div>
                                      {location.pathname === module.path && (
                                        <div className="absolute left-0 w-1 h-8 bg-ey-yellow rounded-r-full"></div>
                                      )}
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    <p>{module.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          )}
                        </Collapsible>
                      )}
                    </div>
                  ))}
                  
                  {/* AI Agents section */}
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
                          <div className="flex-shrink-0">
                            <BrainCog className="h-5 w-5" />
                          </div>
                          
                          {isExpanded && (
                            <motion.span 
                              className="ml-3 whitespace-nowrap"
                              initial="visible"
                              animate="visible"
                              variants={contentVariants}
                            >
                              Your Agents
                            </motion.span>
                          )}
                        </div>
                        
                        {isExpanded && (
                          <motion.div
                            initial="visible"
                            animate="visible"
                            variants={contentVariants}
                          >
                            {isAgentsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </motion.div>
                        )}
                      </button>
                    </CollapsibleTrigger>
                    
                    {isExpanded && (
                      <CollapsibleContent>
                        <div className="ml-2 space-y-1">
                          <ScrollArea className="max-h-60">
                            {loading ? (
                              <div className="animate-pulse p-2">
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="h-9 bg-gray-100 rounded-md mb-2"></div>
                                ))}
                              </div>
                            ) : (
                              <>
                                {agents.length > 0 ? (
                                  agents.map(agent => (
                                    <div key={agent.id} className="relative group">
                                      <Link
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
                                        <span className="truncate flex-1">{agent.name}</span>
                                        {agent.status === 'active' && (
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                        )}
                                        <button
                                          onClick={(e) => handleRemoveAgent(agent, e)}
                                          className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                          title="Remove agent"
                                        >
                                          <Trash className="h-3.5 w-3.5 text-red-500" />
                                        </button>
                                      </Link>
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-3 px-2 text-sm text-ey-lightGray">
                                    No agents added yet
                                  </div>
                                )}
                                
                                {/* Add More Agents button */}
                                <button
                                  onClick={handleMarketplaceOpen}
                                  className="flex items-center w-full p-2 rounded-md text-sm text-purple-600 hover:bg-purple-50 mt-2 transition-colors"
                                >
                                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                                    <Plus className="h-3.5 w-3.5" />
                                  </div>
                                  <span>Add More Agents</span>
                                </button>
                              </>
                            )}
                          </ScrollArea>
                        </div>
                      </CollapsibleContent>
                    )}
                    
                    {/* For collapsed state, show mini agent buttons with tooltips */}
                    {!isExpanded && isAgentsOpen && (
                      <div className="space-y-1 mt-1">
                        {loading ? (
                          <div className="animate-pulse p-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="h-8 w-8 bg-gray-100 rounded-full mb-2 mx-auto"></div>
                            ))}
                          </div>
                        ) : (
                          <>
                            {agents.length > 0 ? (
                              agents.map(agent => (
                                <Tooltip key={agent.id}>
                                  <TooltipTrigger asChild>
                                    <Link
                                      to={`/agent/${agent.id}`}
                                      className={`flex items-center justify-center p-2 rounded-md mb-1 relative ${
                                        agentId === agent.id
                                          ? 'bg-purple-100 text-purple-700'
                                          : 'text-ey-darkGray/70 hover:bg-gray-100'
                                      }`}
                                    >
                                      <div className={`w-6 h-6 rounded-full ${
                                        agent.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                                      } flex items-center justify-center`}>
                                        {getAgentIcon(agent.icon)}
                                      </div>
                                      {agent.status === 'active' && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                      )}
                                      {agentId === agent.id && (
                                        <div className="absolute left-0 w-1 h-8 bg-purple-600 rounded-r-full"></div>
                                      )}
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    <p>{agent.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))
                            ) : (
                              <div className="flex justify-center items-center py-2">
                                <Badge variant="outline" className="bg-gray-100 text-xs">No agents</Badge>
                              </div>
                            )}
                            
                            {/* Add More Agents mini button */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={handleMarketplaceOpen}
                                  className="flex items-center justify-center p-2 rounded-md text-purple-600 hover:bg-purple-50 mx-auto mt-1 transition-colors"
                                >
                                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Plus className="h-3.5 w-3.5" />
                                  </div>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>Add More Agents</p>
                              </TooltipContent>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    )}
                  </Collapsible>
                </div>
              </ScrollArea>
            </div>
            
            {/* Fixed footer section with settings and collapse button */}
            <div className="py-4 mt-auto border-t border-gray-100">
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
                  <Button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center p-3 rounded-lg bg-ey-yellow/30 text-ey-darkGray hover:bg-ey-yellow/40 transition-all duration-300"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    <span>Collapse Sidebar</span>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center space-y-4 mb-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:bg-ey-yellow/10 text-ey-darkGray/70"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Settings</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="hover:bg-ey-yellow/10 text-red-500"
                          onClick={logout}
                        >
                          <LogOut className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Logout</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex items-center justify-center p-3 rounded-lg bg-ey-yellow/30 text-ey-darkGray hover:bg-ey-yellow/40 transition-all duration-300"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Expand Sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
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
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="border rounded-lg p-4 h-28 animate-pulse bg-gray-100"></div>
                  ))}
                </div>
              ) : availableAgents.length > 0 ? (
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
                            disabled={addingAgent === agent.id}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            {addingAgent === agent.id ? (
                              <div className="h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-1" />
                            ) : (
                              <Plus className="h-3.5 w-3.5 mr-1" />
                            )}
                            Add Agent
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BrainCog className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-ey-darkGray mb-2">No available agents</h3>
                  <p className="text-ey-lightGray">
                    You've already added all available agents to your workspace.
                  </p>
                </div>
              )}
            </ScrollArea>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMarketplace(false)}>
                Close
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
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

        {/* Agent remove confirmation dialog */}
        <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Agent</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {selectedAgentToRemove?.name} from your workspace? 
                You can always add it back later from the marketplace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmRemoveAgent}
                className="bg-red-500 hover:bg-red-600"
              >
                {removingAgent === selectedAgentToRemove?.id ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                ) : (
                  <Trash className="h-4 w-4 mr-1" />
                )}
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.aside>
    </TooltipProvider>
  );
};

// Fix for missing icon imports
import { CheckCircle, Shield, Globe, Lightbulb } from 'lucide-react';

export default Navigation;
