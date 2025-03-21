
import React from 'react';
import { motion } from 'framer-motion';
import { BrainCog, LockKeyhole } from 'lucide-react';
import AiAgentCard from '../AiAgentCard';
import { useAuth } from '@/context/AuthContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface MarketplaceAgentsListProps {
  agents: any[];
  searchQuery: string;
  onDeployAgent: (agentId: number) => Promise<void>;
  deployingAgent: number | null;
}

const MarketplaceAgentsList: React.FC<MarketplaceAgentsListProps> = ({ 
  agents, 
  searchQuery, 
  onDeployAgent,
  deployingAgent
}) => {
  const { hasAgentAccess } = useAuth();
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = React.useState(false);
  const [deniedAgentName, setDeniedAgentName] = React.useState('');
  
  // Immediate filter rendering for better performance
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filteredAgents.length === 0) {
    return (
      <div className="text-center py-12">
        <BrainCog className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-ey-darkGray mb-2">No agents found</h3>
        <p className="text-ey-lightGray mb-6">
          {searchQuery ? 'No agents match your search criteria.' : 'All available agents have already been deployed.'}
        </p>
      </div>
    );
  }
  
  const handleAgentDeployment = async (agentId: number) => {
    // Check if user has permission to deploy this agent
    const agent = filteredAgents.find(a => a.id === agentId);
    if (!hasAgentAccess(agentId)) {
      setDeniedAgentName(agent?.name || 'this agent');
      setShowAccessDeniedDialog(true);
      return;
    }
    
    // If they have access, proceed with deployment
    await onDeployAgent(agentId);
  };
  
  // Enhanced rendering with performance optimizations
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent, index) => {
          const userHasAccess = hasAgentAccess(agent.id);
          const restrictedBadge = !userHasAccess ? (
            <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded-md text-xs flex items-center">
              <LockKeyhole className="h-3 w-3 mr-1" />
              Restricted
            </div>
          ) : null;
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.3) }} // Cap delay for better performance
              className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg overflow-hidden border border-white/10"
            >
              <AiAgentCard
                id={agent.id}
                name={agent.name}
                description={agent.description}
                status="active"
                confidence={agent.confidence}
                icon={agent.icon}
                onActivate={handleAgentDeployment}
                isExpanded={true}
                deploying={deployingAgent === agent.id}
                isUserAgent={false}
                restrictedBadge={restrictedBadge}
              />
            </motion.div>
          );
        })}
      </div>
      
      {/* Access Denied Dialog */}
      <AlertDialog open={showAccessDeniedDialog} onOpenChange={setShowAccessDeniedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-700">
              <LockKeyhole className="h-5 w-5" />
              Access Restricted
            </AlertDialogTitle>
            <AlertDialogDescription>
              You don't have permission to use {deniedAgentName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 bg-amber-50 rounded-md">
            <p className="text-sm text-amber-800">
              This agent requires special permission. Please contact your administrator to request access.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MarketplaceAgentsList;
