
import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import Navigation from './Navigation';
import Header from './Header';
import { getModuleInsights } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ModuleInsightsPanel from './module/ModuleInsightsPanel';
import ModuleActions from './module/ModuleActions';
import AiDashboard from './module/AiDashboard';
import AiChatInterface from './AiChatInterface';

export interface ModuleInsight {
  id: number;
  text: string;
  type?: 'insight' | 'alert' | 'suggestion' | 'opportunity';
  impact?: 'high' | 'medium' | 'low';
}

interface ModuleLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  moduleName?: string; // Used for API calls
  insights?: ModuleInsight[]; // Make insights an optional prop
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({ 
  title, 
  description, 
  icon, 
  children,
  moduleName,
  insights: propInsights
}) => {
  const [insights, setInsights] = useState<ModuleInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAiDashboard, setShowAiDashboard] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchInsights = async () => {
      // If insights are provided as props, use them
      if (propInsights) {
        setInsights(propInsights);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Convert title to kebab case for API calls
        const module = moduleName || title.toLowerCase().replace(/\s+/g, '-');
        const data = await getModuleInsights(module);
        
        // Handle different input data types
        let typedInsights: ModuleInsight[] = [];
        
        if (Array.isArray(data)) {
          // If data is an array of strings
          if (data.length > 0 && typeof data[0] === 'string') {
            typedInsights = data.map((item: string, index: number) => ({
              id: index + 1,
              text: item,
              type: ['insight', 'suggestion', 'opportunity', 'alert'][Math.floor(Math.random() * 4)] as ModuleInsight['type'],
              impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as ModuleInsight['impact']
            }));
          }
          // If data is already an array of ModuleInsight objects
          else if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null && 'text' in data[0]) {
            typedInsights = data.map((item: any, index: number) => ({
              id: item.id || index + 1,
              text: item.text,
              type: item.type || 'insight',
              impact: item.impact || 'medium'
            }));
          }
        }
        
        // If no valid data or empty array, provide fallback insights
        if (typedInsights.length === 0) {
          typedInsights = [
            { id: 1, text: `AI analysis complete for ${title}. Optimization opportunities identified.`, type: 'opportunity', impact: 'high' },
            { id: 2, text: `Machine learning prediction suggests potential improvements for ${module}.`, type: 'suggestion', impact: 'medium' },
            { id: 3, text: `Anomaly detection has identified a pattern that requires attention.`, type: 'alert', impact: 'high' }
          ];
        }
        
        setInsights(typedInsights);
      } catch (error) {
        console.error('Error fetching module insights:', error);
        toast({
          variant: "destructive",
          title: "Failed to load AI insights",
          description: "Please try again later"
        });
        
        // Fallback insights
        setInsights([
          { id: 1, text: `AI analysis for ${title} is temporarily unavailable.`, type: 'alert', impact: 'medium' },
          { id: 2, text: `We recommend running a manual check until AI services are restored.`, type: 'suggestion', impact: 'medium' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInsights();
  }, [title, moduleName, propInsights, toast]);

  // Get metrics based on module name
  const module = moduleName || title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-8">
        <Header pageTitle={title} />
        
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-ey-yellow/10 mr-3">
                {icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-ey-darkGray">{title}</h1>
                <p className="text-ey-lightGray">{description}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
              onClick={() => setShowAiDashboard(!showAiDashboard)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              {showAiDashboard ? "Hide AI Dashboard" : "Show AI Dashboard"}
            </Button>
          </div>
          <div className="mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-ey-yellow mr-1"><path d="M6 12h.01M12 12h.01M18 12h.01M6 6h.01M12 6h.01M18 6h.01"/></svg>
            <span className="text-sm text-ey-darkGray font-medium">AI-Powered Module</span>
          </div>
        </div>
        
        {showAiDashboard && <AiDashboard title={title} module={module} />}
        
        <ModuleActions />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            {children}
          </div>
          
          <div className="col-span-1 space-y-6">
            <ModuleInsightsPanel 
              title={title} 
              insights={insights} 
              isLoading={isLoading} 
            />
            
            <AiChatInterface moduleContext={title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleLayout;
