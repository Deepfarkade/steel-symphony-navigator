import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import AiChatInterface from '../components/AiChatInterface';
import { ChatProvider } from '@/context/ChatContext';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, LockKeyhole } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface AgentPageParams {
  [key: string]: string;
  agentId: string;
}

const AgentChatPage = () => {
  const { agentId } = useParams<AgentPageParams>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasAgentAccess } = useAuth();
  
  const agentIdNum = parseInt(agentId || "0", 10);
  const hasAccess = hasAgentAccess(agentIdNum);
  
  // Check access rights immediately
  useEffect(() => {
    if (!hasAccess) {
      // Show access denied toast
      toast({
        variant: "destructive",
        title: "Access Restricted",
        description: "You don't have permission to access this agent. Please contact your administrator.",
      });
      
      // Redirect to agents page
      navigate('/agents');
    }
  }, [hasAccess, agentId, navigate, toast]);
  
  useEffect(() => {
    const handleSidebarChange = (event: CustomEvent) => {
      const { isCollapsed } = event.detail;
      setSidebarCollapsed(isCollapsed);
    };

    document.addEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    
    // Check if sidebar is already collapsed on mount
    const currentState = document.body.getAttribute('data-sidebar-collapsed');
    if (currentState === 'true') {
      setSidebarCollapsed(true);
    }
    
    return () => {
      document.removeEventListener('sidebar-state-changed', handleSidebarChange as EventListener);
    };
  }, []);

  // If user doesn't have access, show an access denied message
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockKeyhole className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this agent. Please contact your administrator for access.
          </p>
          <Button 
            onClick={() => navigate('/agents')}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Return to Agent Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <Navigation />
      
      <div 
        className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-64'} h-screen`}
      >
        <ChatProvider agentId={agentIdNum}>
          <AiChatInterface agentId={agentIdNum} disableFloatingButton={true} />
        </ChatProvider>
      </div>
    </div>
  );
};

export default AgentChatPage;
