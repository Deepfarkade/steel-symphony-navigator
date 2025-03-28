
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Zap, Activity, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import AiChatInterface from '../components/AiChatInterface';
import { getAgentById, getAgentAnalytics, getAgentRecommendations } from '@/services/dataService';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface AgentParams {
  [key: string]: string;
  agentId: string;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  impact: string;
  category: string;
}

const AgentChatPage = () => {
  const { agentId } = useParams<AgentParams>();
  const [agent, setAgent] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAccessDeniedDialog, setShowAccessDeniedDialog] = useState(false);
  const { theme } = useTheme();
  const { hasAgentAccess } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAgentData = async () => {
      if (!agentId) return;
      
      // Check if user has access to this agent
      if (!hasAgentAccess(Number(agentId))) {
        setShowAccessDeniedDialog(true);
        return;
      }
      
      setLoading(true);
      try {
        const [agentData, analyticsData, recommendationsData] = await Promise.all([
          getAgentById(Number(agentId)),
          getAgentAnalytics(Number(agentId)),
          getAgentRecommendations(Number(agentId))
        ]);
        
        setAgent(agentData);
        setAnalytics(analyticsData);
        
        if (Array.isArray(recommendationsData)) {
          if (recommendationsData.length > 0) {
            if (typeof recommendationsData[0] === 'object' && recommendationsData[0] !== null && 'title' in recommendationsData[0]) {
              setRecommendations(recommendationsData as Recommendation[]);
            } 
            else {
              const stringItems: unknown[] = recommendationsData.filter(item => typeof item === 'string');
              const formatted: Recommendation[] = stringItems.map((rec, index) => ({
                id: index + 1,
                title: `Recommendation ${index + 1}`,
                description: rec as string,
                impact: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
                category: 'AI'
              }));
              setRecommendations(formatted);
            }
          } else {
            setRecommendations([]);
          }
        } else {
          setRecommendations([]);
        }
      } catch (error) {
        console.error('Error fetching agent data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgentData();
  }, [agentId, hasAgentAccess]);

  const handleAccessDeniedClose = () => {
    setShowAccessDeniedDialog(false);
    navigate('/agents');
  };

  if (showAccessDeniedDialog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div data-main-content className="ml-[256px] p-8 transition-all duration-300">
          <AlertDialog open={showAccessDeniedDialog} onOpenChange={handleAccessDeniedClose}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  Access Restricted
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You don't have permission to access this agent.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="p-4 bg-amber-50 rounded-md">
                <p className="text-sm text-amber-800">
                  This agent requires special permission. Please contact your administrator to request access.
                </p>
              </div>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleAccessDeniedClose}>
                  Return to Agents
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div data-main-content className="ml-[256px] p-8 transition-all duration-300">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-purple-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div data-main-content className="ml-[256px] p-8 transition-all duration-300">
          <div className="flex flex-col justify-center items-center h-[60vh]">
            <h2 className="text-2xl font-bold text-ey-darkGray mb-4">Agent Not Found</h2>
            <p className="text-ey-lightGray mb-6">The requested AI agent could not be found or has been deactivated.</p>
            <Link to="/agents">
              <button className="bg-ey-yellow text-ey-black px-4 py-2 rounded-md hover:bg-ey-yellow/90">
                View All Agents
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-ey-black/90">
      <Navigation />
      
      <div data-main-content className="ml-[256px] p-8 transition-all duration-300">
        <Header 
          pageTitle={`AI Agent: ${agent?.name}`}
          breadcrumbs={[
            { label: 'Home', link: '/' },
            { label: 'Agents', link: '/agents' },
            { label: agent?.name, link: `/agent/${agentId}` }
          ]}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <Card className="h-full overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-[#161B2E] to-[#2E2E38] text-white rounded-t-lg">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <BrainCircuit className="h-6 w-6 text-ey-yellow" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">{agent?.name}</CardTitle>
                    <div className="text-white/80 text-sm">{agent?.description}</div>
                  </div>
                  <Badge className="ml-auto bg-green-500 text-white">
                    {agent?.status === 'active' ? 'Active' : 'Learning'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                <div className="p-6 h-[calc(100vh-350px)]">
                  <AiChatInterface agentId={Number(agentId)} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Activity className="h-5 w-5 text-ey-yellow mr-2" />
                    Agent Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {analytics && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-xs text-purple-600 mb-1">Issues Resolved</div>
                        <div className="text-xl font-bold text-ey-darkGray">{analytics.issuesResolved}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-blue-600 mb-1">Avg. Response</div>
                        <div className="text-xl font-bold text-ey-darkGray">{analytics.avgResponseTime}s</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-xs text-green-600 mb-1">Satisfaction</div>
                        <div className="text-xl font-bold text-ey-darkGray">{analytics.userSatisfaction}%</div>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="text-xs text-indigo-600 mb-1">Conversations</div>
                        <div className="text-xl font-bold text-ey-darkGray">{analytics.conversationsCompleted}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center">
                    <Zap className="h-5 w-5 text-ey-yellow mr-2" />
                    Agent Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {recommendations.length > 0 ? (
                      recommendations.map((rec, index) => (
                        <motion.div 
                          key={rec.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-yellow-50 p-3 rounded-lg border-l-4 border-ey-yellow"
                        >
                          <p className="text-sm text-ey-darkGray">{rec.description}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-yellow-600 font-medium">{rec.impact} Impact</span>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-ey-lightGray">
                        <p>No recommendations available yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentChatPage;
