
import React from 'react';
import { motion } from 'framer-motion';
import { BrainCog, LockKeyhole } from 'lucide-react';
import AiAgentCard from '../AiAgentCard';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

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
  
  // Separate agents into accessible and restricted groups for better UX
  const accessibleAgents = filteredAgents.filter(agent => hasAgentAccess(agent.id));
  const restrictedAgents = filteredAgents.filter(agent => !hasAgentAccess(agent.id));
  
  // Enhanced rendering with performance optimizations
  return (
    <div className="space-y-8">
      {/* Accessible Agents Section */}
      {accessibleAgents.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium text-ey-darkGray">Available for Deployment</h3>
            <Badge className="ml-3 bg-green-100 text-green-800">Authorized Access</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessibleAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg overflow-hidden border border-white/10"
              >
                <AiAgentCard
                  id={agent.id}
                  name={agent.name}
                  description={agent.description}
                  status="active"
                  confidence={agent.confidence}
                  icon={agent.icon}
                  onActivate={onDeployAgent}
                  isExpanded={true}
                  deploying={deployingAgent === agent.id}
                  isUserAgent={false}
                  showAccessIndicator={false} // Hide the indicator for accessible agents
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Restricted Agents Section */}
      {restrictedAgents.length > 0 && (
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium text-ey-darkGray">Requires Special Access</h3>
            <Badge className="ml-3 bg-amber-100 text-amber-800 flex items-center">
              <LockKeyhole className="h-3 w-3 mr-1" />
              Restricted
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restrictedAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg overflow-hidden border border-amber-500/30"
              >
                <AiAgentCard
                  id={agent.id}
                  name={agent.name}
                  description={agent.description}
                  status="active"
                  confidence={agent.confidence}
                  icon={agent.icon}
                  onActivate={onDeployAgent}
                  isExpanded={true}
                  deploying={deployingAgent === agent.id}
                  isUserAgent={false}
                  showAccessIndicator={true} // Show the access restriction indicator
                />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> The agents above require special permissions. Please contact your administrator to request access.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceAgentsList;
