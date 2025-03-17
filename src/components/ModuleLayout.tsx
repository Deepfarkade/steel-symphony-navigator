
import React from 'react';
import { Rocket } from 'lucide-react';
import Navigation from './Navigation';
import Header from './Header';
import AiChatInterface from './AiChatInterface';

interface ModuleInsight {
  id: number;
  text: string;
}

interface ModuleLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  insights: ModuleInsight[];
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({ 
  title, 
  description, 
  icon, 
  children,
  insights
}) => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-8">
        <Header pageTitle={title} />
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-ey-yellow/10 mr-3">
              {icon}
            </div>
            <h1 className="text-2xl font-bold text-ey-darkGray">{title}</h1>
          </div>
          <p className="text-ey-lightGray">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            {children}
          </div>
          
          <div className="col-span-1 space-y-6">
            <div className="ey-card p-6">
              <h2 className="text-lg font-medium text-ey-darkGray mb-4">AI-Generated Insights</h2>
              <div className="space-y-4">
                {insights.map(insight => (
                  <div key={insight.id} className="p-4 bg-ey-yellow/5 rounded-lg border border-ey-yellow/20">
                    <div className="flex">
                      <Rocket className="h-5 w-5 text-ey-yellow mr-3 flex-shrink-0" />
                      <p className="text-ey-darkGray">{insight.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <AiChatInterface moduleContext={title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleLayout;
