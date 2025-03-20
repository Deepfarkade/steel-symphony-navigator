
import React from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';

const AgentsMarketplaceHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
      <Button 
        className="bg-indigo-500 hover:bg-indigo-600 text-white"
        onClick={() => navigate('/create-agent')}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Create Custom Agent
      </Button>
    </div>
  );
};

export default AgentsMarketplaceHeader;
