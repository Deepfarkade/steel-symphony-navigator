
import { useState, useEffect, useCallback } from 'react';
import { getAiAgents, removeAgentFromUser } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'learning';
  confidence: number;
  icon: string;
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAiAgents();
      setAgents(result);
      return result;
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const deleteAgent = async (id: number) => {
    try {
      await removeAgentFromUser(id);
      setAgents(prev => prev.filter(agent => agent.id !== id));
      toast({
        title: "Agent removed",
        description: "The agent has been removed from your workspace and is now available in the marketplace."
      });
      return true;
    } catch (error) {
      console.error('Error removing agent:', error);
      toast({
        title: "Removal failed",
        description: "Failed to remove the agent. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    agents,
    loading,
    deleteAgent,
    refreshAgents: fetchAgents
  };
}
