
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import AiChatInterface from '../components/AiChatInterface';
import { getAgentData } from '../services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Sparkles, Brain, Activity, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ModuleChatPage = () => {
  const { module } = useParams<{ module: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const agentId = queryParams.get('agent');
  
  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agentId) {
      setLoading(true);
      const fetchAgentData = async () => {
        try {
          const data = await getAgentData(parseInt(agentId));
          setAgentData(data);
        } catch (error) {
          console.error('Error fetching agent data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchAgentData();
    }
  }, [agentId]);

  const formatModuleName = (name?: string) => {
    if (!name) return '';
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <ModuleLayout
      title={agentData ? `Chat with ${agentData.name}` : `${formatModuleName(module)} Assistant`}
      description={agentData ? agentData.description : "Ask questions and get AI-powered assistance related to your steel operations"}
      icon={agentData ? agentData.icon || "message-square" : "message-square"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <AiChatInterface 
            moduleContext={module || (agentData ? agentData.name : undefined)} 
          />
        </div>
        <div className="space-y-6">
          {loading ? (
            <>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : agentData ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ey-darkGray">
                    <Activity className="h-5 w-5 mr-2 text-purple-500" />
                    Agent Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-ey-lightGray">Analysis Count</p>
                      <p className="text-xl font-medium text-ey-darkGray">{agentData.metrics.analysisCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-ey-lightGray">Success Rate</p>
                      <p className="text-xl font-medium text-ey-darkGray">{agentData.metrics.successRate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-ey-lightGray">Suggestions Implemented</p>
                      <p className="text-xl font-medium text-ey-darkGray">{agentData.metrics.suggestionsImplemented}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-ey-lightGray">Time Active</p>
                      <p className="text-xl font-medium text-ey-darkGray">{agentData.metrics.timeActive}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ey-darkGray">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                    Top Recommendations
                  </CardTitle>
                  <CardDescription>
                    Agent-generated suggestions based on your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {agentData.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-ey-darkGray">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ey-darkGray">
                    <Brain className="h-5 w-5 mr-2 text-purple-500" />
                    {formatModuleName(module)} AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                      <span className="text-sm text-ey-darkGray">Ask questions about {formatModuleName(module)}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                      <span className="text-sm text-ey-darkGray">Get real-time data analysis and insights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                      <span className="text-sm text-ey-darkGray">Generate reports and recommendations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-ey-darkGray">
                    <BarChart2 className="h-5 w-5 mr-2 text-purple-500" />
                    Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Data Analysis</span>
                        <span>95%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Recommendations</span>
                        <span>88%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Predictions</span>
                        <span>82%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
};

export default ModuleChatPage;
