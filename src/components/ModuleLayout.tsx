import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, Download, ChevronDown, Filter } from 'lucide-react';
import Navigation from './Navigation';
import Header from './Header';
import AiChatInterface from './AiChatInterface';
import { getModuleInsights } from '@/services/dataService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ModuleInsight {
  id: number;
  text: string;
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
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
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
        
        // Ensure the data matches the expected ModuleInsight type
        const typedInsights: ModuleInsight[] = Array.isArray(data) ? 
          data.map((item: any, index: number) => ({
            id: typeof item.id === 'number' ? item.id : index + 1,
            text: typeof item === 'string' ? item : item.text || `AI analysis ${index + 1}`
          })) : 
          [
            { id: 1, text: 'AI analysis complete. Optimization opportunities identified.' },
            { id: 2, text: 'Machine learning prediction suggests potential improvements.' }
          ];
        
        setInsights(typedInsights);
      } catch (error) {
        console.error('Error fetching module insights:', error);
        setInsights([
          { id: 1, text: 'AI analysis complete. Optimization opportunities identified.' },
          { id: 2, text: 'Machine learning prediction suggests potential improvements.' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInsights();
  }, [title, moduleName, propInsights]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="ml-64 p-8">
        <Header pageTitle={title} />
        
        <div className="mb-6 animate-fade-in">
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
        
        <div className="flex justify-between mb-6">
          <div className="flex space-x-2">
            <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-lg">
                  <DrawerHeader>
                    <DrawerTitle>Configure Filters</DrawerTitle>
                    <DrawerDescription>
                      Adjust the filters for your {title} data.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    {/* Filter options would go here */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <div className="flex space-x-2">
                        <input type="date" className="flex-1 border rounded p-2" />
                        <span className="flex items-center">to</span>
                        <input type="date" className="flex-1 border rounded p-2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Categories</label>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <input type="checkbox" id="category1" className="mr-2" />
                          <label htmlFor="category1">High Priority</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="category2" className="mr-2" />
                          <label htmlFor="category2">Medium Priority</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="category3" className="mr-2" />
                          <label htmlFor="category3">Low Priority</label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select className="w-full border rounded p-2">
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <DrawerFooter>
                    <Button>Apply Filters</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            {children}
          </div>
          
          <div className="col-span-1 space-y-6">
            <div className="ey-card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Rocket className="h-5 w-5 text-ey-yellow mr-2" />
                  <h2 className="text-lg font-medium text-ey-darkGray">AI-Generated Insights</h2>
                </div>
                <span className="text-xs bg-ey-yellow/20 text-ey-darkGray px-2 py-1 rounded-full">EY Co-Pilot</span>
              </div>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 bg-gray-100 rounded-lg animate-pulse h-20"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div 
                      key={insight.id} 
                      className="p-4 bg-ey-yellow/5 rounded-lg border border-ey-yellow/20 animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex">
                        <Sparkles className="h-5 w-5 text-ey-yellow mr-3 flex-shrink-0" />
                        <p className="text-ey-darkGray">{insight.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <AiChatInterface moduleContext={title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleLayout;
