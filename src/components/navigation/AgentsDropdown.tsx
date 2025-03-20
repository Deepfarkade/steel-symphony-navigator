
import React from 'react';
import { BrainCircuit } from 'lucide-react';
import SidebarDropdown from '../sidebar/SidebarDropdown';
import SidebarItem from '../sidebar/SidebarItem';
import AgentItem from '../sidebar/AgentItem';
import { getIconComponent } from '@/utils/iconUtils';
import { useAgents } from '@/hooks/useAgents';
import { useTheme } from '@/context/ThemeContext';

interface AgentsDropdownProps {
  isCollapsed: boolean;
}

const AgentsDropdown: React.FC<AgentsDropdownProps> = ({ isCollapsed }) => {
  const { agents, loading, deleteAgent } = useAgents();
  const { theme } = useTheme();
  
  return (
    <SidebarDropdown 
      title="Your Agents" 
      icon={<BrainCircuit className="h-5 w-5 text-ey-yellow" />} 
      isCollapsed={isCollapsed}
      activeRoutes={['/agent/', '/agents']}
      theme={theme}
    >
      <div className="py-2 space-y-1">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className={`w-full h-10 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700/20'} animate-pulse rounded-md mb-1`}></div>
          ))
        ) : agents.length > 0 ? (
          agents.map(agent => (
            <AgentItem
              key={agent.id}
              id={agent.id}
              name={agent.name}
              icon={getIconComponent(agent.icon)}
              to={`/agent/${agent.id}`}
              isCollapsed={isCollapsed}
              onDelete={deleteAgent}
              theme={theme}
            />
          ))
        ) : (
          // Only display this message when sidebar is expanded
          !isCollapsed && (
            <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} py-2 px-3`}>
              No agents deployed yet
            </div>
          )
        )}
        
        <SidebarItem
          title="Add New Agent"
          icon={getIconComponent('plus', "h-5 w-5 text-ey-yellow")}
          to="/agents"
          isCollapsed={isCollapsed}
          badge={<span className="px-2 py-0.5 text-xs bg-ey-yellow/20 text-ey-yellow rounded-full">Marketplace</span>}
          theme={theme}
          isInDropdown={true}
        />
        
        <SidebarItem
          title="All Agents"
          icon={getIconComponent('layout-grid', "h-5 w-5 text-ey-yellow")}
          to="/agents"
          isCollapsed={isCollapsed}
          activeCheck={(path) => path === "/agents"}
          theme={theme}
          isInDropdown={true}
        />
      </div>
    </SidebarDropdown>
  );
};

export default AgentsDropdown;
