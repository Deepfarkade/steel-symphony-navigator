
import React from 'react';
import { Rocket, Sparkles } from 'lucide-react';
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
          <div className="mt-2 flex items-center">
            <Sparkles className="h-4 w-4 text-ey-yellow mr-1" />
            <span className="text-sm text-ey-darkGray font-medium">AI-Powered Module</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            {children}
          </div>
          
          <div className="col-span-1 space-y-6">
            <div className="ey-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Rocket className="h-5 w-5 text-ey-yellow mr-2" />
                  <h2 className="text-lg font-medium text-ey-darkGray">AI-Generated Insights</h2>
                </div>
                <span className="text-xs bg-ey-yellow/20 text-ey-darkGray px-2 py-1 rounded-full">EY Co-Pilot</span>
              </div>
              <div className="space-y-4">
                {insights.map(insight => (
                  <div key={insight.id} className="p-4 bg-ey-yellow/5 rounded-lg border border-ey-yellow/20">
                    <div className="flex">
                      <Sparkles className="h-5 w-5 text-ey-yellow mr-3 flex-shrink-0" />
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
