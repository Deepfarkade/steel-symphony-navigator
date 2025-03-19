
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import ModuleLayout from '@/components/ModuleLayout';
import { Button } from '@/components/ui/button';
import { getModuleInsights } from '@/services/dataService';

// Updated interface to properly handle useParams
interface ModuleChatParams {
  module: string;
}

const ModuleChatPage = () => {
  const params = useParams<ModuleChatParams>();
  const module = params.module;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
    icon: <MessageCircle className="h-5 w-5 text-ey-yellow" />
  });

  useEffect(() => {
    const fetchModuleData = async () => {
      setLoading(true);
      
      try {
        let title = '';
        let description = '';
        let icon = <MessageCircle className="h-5 w-5 text-ey-yellow" />;
        
        // Map the module slug to a proper title and description
        switch(module) {
          case 'demand-planning':
            title = 'Demand Planning';
            description = 'Optimize your demand forecasting with AI assistance';
            icon = <MessageCircle className="h-5 w-5 text-blue-600" />;
            break;
          case 'supply-planning':
            title = 'Supply Planning';
            description = 'Streamline your supply chain with intelligent optimization';
            icon = <MessageCircle className="h-5 w-5 text-green-600" />;
            break;
          case 'factory-planning':
            title = 'Factory Planning';
            description = 'Maximize production efficiency with AI-guided planning';
            icon = <MessageCircle className="h-5 w-5 text-purple-600" />;
            break;
          default:
            // If no specific module is matched, use a generic title based on the slug
            title = module?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Chat';
            description = `AI-powered assistance for ${title}`;
            icon = <MessageCircle className="h-5 w-5 text-ey-yellow" />;
        }
        
        setModuleData({
          title,
          description,
          icon
        });
      } catch (error) {
        console.error('Error fetching module data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModuleData();
  }, [module]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertTriangle className="h-12 w-12 text-ey-yellow mb-4" />
        <h1 className="text-2xl font-bold mb-2">Module Not Found</h1>
        <p className="text-ey-lightGray mb-6">Sorry, we couldn't find the chat module you were looking for.</p>
        <Button onClick={() => navigate('/chat')}>Return to Chat Home</Button>
      </div>
    );
  }
  
  return (
    <ModuleLayout
      title={moduleData.title}
      description={moduleData.description}
      icon={moduleData.icon}
    >
      <div className="ey-card p-6">
        <h2 className="text-xl font-semibold mb-4">Chat with {moduleData.title} AI Assistant</h2>
        <p className="text-ey-lightGray mb-6">
          This dedicated chat interface allows you to interact directly with our specialized AI 
          assistant for {moduleData.title.toLowerCase()}. Ask questions, request data analysis,
          or get recommendations specific to this module.
        </p>
      </div>
    </ModuleLayout>
  );
};

export default ModuleChatPage;
