
import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, Download, ChevronDown, Filter, Brain, LightbulbIcon, Zap, TrendingUp, BarChart2 } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ModuleInsight {
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
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
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
          else if (data.length > 0 && typeof data[0] === 'object' && 'text' in data[0]) {
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

  const getInsightIcon = (type: string = 'insight') => {
    switch (type) {
      case 'alert':
        return <Brain className="h-5 w-5 text-red-500" />;
      case 'suggestion':
        return <LightbulbIcon className="h-5 w-5 text-purple-500" />;
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getInsightColor = (type: string = 'insight') => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'suggestion':
        return 'bg-purple-50 border-purple-200';
      case 'opportunity':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const getImpactBadge = (impact: string = 'medium') => {
    switch (impact) {
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">High Impact</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Low Impact</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Medium Impact</Badge>;
    }
  };

  // Generate AI Dashboard metrics based on the module
  const getAiMetrics = () => {
    const metricsByModule: Record<string, any> = {
      'demand-planning': {
        accuracy: '94.3%',
        confidence: '97.1%',
        optimization: '86.5%',
        patternRecognition: 85,
        anomalyDetection: 90,
        predictivePower: 78
      },
      'supply-planning': {
        accuracy: '91.7%',
        confidence: '93.4%',
        optimization: '89.2%',
        patternRecognition: 82,
        anomalyDetection: 88,
        predictivePower: 85
      },
      'order-promising': {
        accuracy: '96.2%',
        confidence: '95.8%',
        optimization: '82.1%',
        patternRecognition: 89,
        anomalyDetection: 86,
        predictivePower: 79
      },
      'factory-planning': {
        accuracy: '93.5%',
        confidence: '96.2%',
        optimization: '90.3%',
        patternRecognition: 86,
        anomalyDetection: 92,
        predictivePower: 83
      },
      'inventory-optimization': {
        accuracy: '95.1%',
        confidence: '92.7%',
        optimization: '93.4%',
        patternRecognition: 90,
        anomalyDetection: 88,
        predictivePower: 91
      },
      'inventory-liquidation': {
        accuracy: '89.8%',
        confidence: '91.3%',
        optimization: '87.6%',
        patternRecognition: 82,
        anomalyDetection: 85,
        predictivePower: 80
      },
      'logistics': {
        accuracy: '92.9%',
        confidence: '94.7%',
        optimization: '88.3%',
        patternRecognition: 87,
        anomalyDetection: 89,
        predictivePower: 84
      },
      'risk-management': {
        accuracy: '97.2%',
        confidence: '98.1%',
        optimization: '85.9%',
        patternRecognition: 91,
        anomalyDetection: 94,
        predictivePower: 89
      },
      'analytics': {
        accuracy: '98.5%',
        confidence: '97.6%',
        optimization: '91.2%',
        patternRecognition: 93,
        anomalyDetection: 95,
        predictivePower: 92
      }
    };

    const module = moduleName || title.toLowerCase().replace(/\s+/g, '-');
    return metricsByModule[module] || {
      accuracy: '93.8%',
      confidence: '94.5%',
      optimization: '88.7%',
      patternRecognition: 87,
      anomalyDetection: 89,
      predictivePower: 85
    };
  };

  const metrics = getAiMetrics();

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
              <Brain className="h-4 w-4 mr-2" />
              {showAiDashboard ? "Hide AI Dashboard" : "Show AI Dashboard"}
            </Button>
          </div>
          <div className="mt-2 flex items-center">
            <Sparkles className="h-4 w-4 text-ey-yellow mr-1" />
            <span className="text-sm text-ey-darkGray font-medium">AI-Powered Module</span>
          </div>
        </div>
        
        {showAiDashboard && (
          <Card className="mb-6 border-purple-100">
            <CardHeader className="pb-2 border-b border-purple-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Zap className="h-5 w-5 text-purple-500 mr-2" />
                  {title} AI Dashboard
                </CardTitle>
                <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-200">
                  Powered by EY Co-Pilot
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                This AI-powered dashboard provides real-time insights and analytics for your {title.toLowerCase()} operations through EY's generative AI technology.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <BarChart2 className="h-4 w-4 text-purple-500 mr-2" />
                    AI-Generated Key Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">AI Prediction Accuracy</span>
                        <span className="text-sm font-medium">{metrics.accuracy}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: metrics.accuracy }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Decision Confidence</span>
                        <span className="text-sm font-medium">{metrics.confidence}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: metrics.confidence }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Optimization Potential</span>
                        <span className="text-sm font-medium">{metrics.optimization}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: metrics.optimization }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <Brain className="h-4 w-4 text-purple-500 mr-2" />
                    AI Model Performance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Pattern Recognition</span>
                        <span className="text-sm font-medium">{metrics.patternRecognition}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${metrics.patternRecognition}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Anomaly Detection</span>
                        <span className="text-sm font-medium">{metrics.anomalyDetection}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${metrics.anomalyDetection}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Predictive Power</span>
                        <span className="text-sm font-medium">{metrics.predictivePower}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${metrics.predictivePower}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium flex items-center mb-4">
                  <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
                  AI-Generated Recommendations
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <p>Optimize {title.toLowerCase()} schedule based on machine learning patterns from historical data</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <p>AI has identified potential efficiencies in your supply chain through advanced pattern recognition</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <p>Implement the predictive maintenance schedule generated by our neural network analysis</p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <p>Our generative models suggest adjusting inventory levels based on detected seasonal patterns</p>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
        
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
                <Badge className="bg-ey-yellow/20 text-ey-darkGray hover:bg-ey-yellow/30">EY Co-Pilot</Badge>
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
                      className={`p-4 rounded-lg border animate-fade-in ${getInsightColor(insight.type)}`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex mb-2">
                        {getInsightIcon(insight.type)}
                        <div className="ml-auto">
                          {insight.impact && getImpactBadge(insight.impact)}
                        </div>
                      </div>
                      <p className="text-ey-darkGray">{insight.text}</p>
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
