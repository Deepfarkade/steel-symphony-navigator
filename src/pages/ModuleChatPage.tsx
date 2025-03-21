
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import AiChatInterface from '../components/AiChatInterface';
import { Card } from "@/components/ui/card";
import { ChatProvider } from '@/context/ChatContext';
import { useToast } from '@/hooks/use-toast';
import { hasModuleAccess } from '@/services/authService';

interface ModuleChatParams {
  [key: string]: string;
  module: string;
}

const ModuleChatPage = () => {
  const { module } = useParams<ModuleChatParams>();
  const [moduleName, setModuleName] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user has access to this module
  useEffect(() => {
    if (module && !hasModuleAccess(module)) {
      toast({
        title: "Access Denied",
        description: `You don't have access to the ${module.replace('-', ' ')} module.`,
        variant: "destructive"
      });
      navigate('/');
    }
  }, [module, navigate, toast]);
  
  // Ensure the page starts at the top when navigated to
  useEffect(() => {
    // Use setTimeout to ensure this runs after the component has mounted
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }, 0);
  }, [module]); // Re-run when module changes
  
  useEffect(() => {
    const handleSidebarChange = (event: CustomEvent) => {
      const { isCollapsed } = event.detail;
      setSidebarCollapsed(isCollapsed);
    };

    // Add event listener for sidebar state change
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
  
  useEffect(() => {
    if (module) {
      // Convert path to display name
      const formattedName = module
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      setModuleName(formattedName);
      
      // Set document title
      document.title = `${formattedName} AI Assistant | EY Steel Ecosystem`;
    }
  }, [module]);

  // If module is undefined or invalid, show error or redirect
  if (!module) {
    return <div>Module not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ey-black/90">
      <Navigation />
      
      <div 
        data-main-content 
        className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-64'} p-8`}
      >
        <Header 
          pageTitle={`${moduleName || 'Module'} AI Assistant`}
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: moduleName || 'Module', link: `/${module}` },
            { label: 'AI Assistant', link: `/chat/${module}` }
          ]}
        />
        
        <Card className="mt-6 p-6 overflow-hidden">
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <BrainCircuit className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ey-darkGray dark:text-white">{moduleName} AI Assistant</h2>
              <p className="text-ey-lightGray">Specialized AI support for your {moduleName.toLowerCase()} operations</p>
            </div>
            
            <Link to={`/${module}`} className="ml-auto">
              <button className="flex items-center text-purple-600 hover:text-purple-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to {moduleName}</span>
              </button>
            </Link>
          </div>
          
          <div className="h-[calc(100vh-250px)] bg-white dark:bg-white rounded-lg overflow-hidden">
            <ChatProvider moduleContext={module}>
              <AiChatInterface moduleContext={module} disableFloatingButton={true} />
            </ChatProvider>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ModuleChatPage;
