
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useAgentSelection() {
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const { user } = useAuth();
  
  // Load selected agents from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const savedAgents = localStorage.getItem('user-selected-agents');
      if (savedAgents) {
        try {
          const parsedAgents = JSON.parse(savedAgents);
          setSelectedAgentIds(parsedAgents);
        } catch (e) {
          console.error('Error parsing saved agents:', e);
        }
      }
    }
  }, [user]);
  
  // Save selected agents to localStorage whenever they change
  useEffect(() => {
    if (user && selectedAgentIds.length > 0) {
      localStorage.setItem('user-selected-agents', JSON.stringify(selectedAgentIds));
    }
  }, [selectedAgentIds, user]);
  
  const selectAgent = (agentId: number) => {
    if (!selectedAgentIds.includes(agentId)) {
      setSelectedAgentIds(prev => [...prev, agentId]);
    }
  };
  
  const deselectAgent = (agentId: number) => {
    setSelectedAgentIds(prev => prev.filter(id => id !== agentId));
  };
  
  const isAgentSelected = (agentId: number) => {
    return selectedAgentIds.includes(agentId);
  };
  
  return {
    selectedAgentIds,
    selectAgent,
    deselectAgent,
    isAgentSelected
  };
}
