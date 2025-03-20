
import { useState, useEffect } from 'react';
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

const mockAgents = [
  {
    id: 1,
    name: "Supply Chain Optimizer",
    description: "Analyzes supply chain for bottlenecks and efficiency improvements",
    status: "active" as const,
    confidence: 92,
    icon: "truck"
  },
  {
    id: 2,
    name: "Production Intelligence",
    description: "Monitors production lines and predicts maintenance needs",
    status: "active" as const,
    confidence: 98,
    icon: "bar-chart"
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

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      // Try to get real data first
      const result = await getAiAgents();
      setAgents(result);
    } catch (error) {
      console.error('Error fetching agents:', error);
      // Fallback to mock data
      setAgents(mockAgents);
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id: number) => {
    try {
      await removeAgentFromUser(id);
      setAgents(prev => prev.filter(agent => agent.id !== id));
      toast({
        title: "Agent removed",
        description: "The agent has been removed from your workspace."
      });
    } catch (error) {
      console.error('Error removing agent:', error);
      // Still update the UI for demo purposes
      setAgents(prev => prev.filter(agent => agent.id !== id));
      toast({
        title: "Agent removed",
        description: "The agent has been removed from your workspace."
      });
    }
  };

  return {
    agents,
    loading,
    deleteAgent,
    refreshAgents: fetchAgents
  };
}
