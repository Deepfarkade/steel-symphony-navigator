
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AiAgentCard from '../AiAgentCard';
import { useToast } from '@/hooks/use-toast';

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
  const navigate = useNavigate();
  
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
  
  return (
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
            onActivate={onDeployAgent}
            isExpanded={true}
            deploying={deployingAgent === agent.id}
            isUserAgent={false}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MarketplaceAgentsList;
