
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, BrainCircuit, ChartBar, Check, Shield, Zap, MessagesSquare, Clock, CheckCircle2, PieChart } from 'lucide-react';
import { getAgentById, getAgentAnalytics, getAgentRecommendations } from '@/services/dataService';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AiChatInterface from '@/components/AiChatInterface';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AgentChatParams {
  agentId: string;
}

interface Agent {
  id: number;
  name: string;
  description: string;
  status: string;
  confidence: number;
  icon: string;
}

interface AgentAnalytics {
  issuesResolved: number;
  avgResponseTime: number;
  userSatisfaction: number;
  conversationsCompleted: number;
}

const AgentChatPage = () => {
  const { agentId } = useParams<AgentChatParams>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setLoading(true);
        if (!agentId) return;
        
        const agentData = await getAgentById(parseInt(agentId));
        if (agentData) {
          setAgent(agentData);
          
          // Fetch additional agent data in parallel
          const [analyticsData, recommendationsData] = await Promise.all([
            getAgentAnalytics(agentData.id),
            getAgentRecommendations(agentData.id)
          ]);
          
          setAnalytics(analyticsData);
          setRecommendations(recommendationsData);
        }
      } catch (error) {
        console.error('Error fetching agent data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgentData();
  }, [agentId]);
  
  const getAgentIcon = () => {
    switch (agent?.icon) {
      case 'truck':
        return <Zap className="h-6 w-6 text-white" />;
      case 'bar-chart':
        return <ChartBar className="h-6 w-6 text-white" />;
      case 'zap':
        return <Zap className="h-6 w-6 text-white" />;
      case 'check-circle':
        return <Check className="h-6 w-6 text-white" />;
      case 'shield':
        return <Shield className="h-6 w-6 text-white" />;
      default:
        return <BrainCircuit className="h-6 w-6 text-white" />;
    }
  };
  
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navigation />
        <div data-main-content className="ml-64 p-8">
          <Header pageTitle="Agent Interface" />
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ey-yellow"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!agent) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navigation />
        <div data-main-content className="ml-64 p-8">
          <Header pageTitle="Agent Not Found" />
          <div className="flex flex-col items-center justify-center h-80">
            <p className="text-ey-lightGray mb-4">The requested agent could not be found.</p>
            <Link to="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation agentId={parseInt(agentId || '0')} />
      <div data-main-content className="ml-64 p-8">
        <Header pageTitle={agent.name} />
        
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
              {getAgentIcon()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <p className="text-white/80">{agent.description}</p>
            </div>
          </div>
          
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <CheckCircle2 className="h-5 w-5 text-white mr-2" />
                  <h3 className="font-semibold">Issues Resolved</h3>
                </div>
                <p className="text-2xl font-bold">{analytics.issuesResolved}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-white mr-2" />
                  <h3 className="font-semibold">Avg. Response Time</h3>
                </div>
                <p className="text-2xl font-bold">{analytics.avgResponseTime}s</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <MessagesSquare className="h-5 w-5 text-white mr-2" />
                  <h3 className="font-semibold">Conversations</h3>
                </div>
                <p className="text-2xl font-bold">{analytics.conversationsCompleted}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <PieChart className="h-5 w-5 text-white mr-2" />
                  <h3 className="font-semibold">User Satisfaction</h3>
                </div>
                <div className="flex items-center">
                  <p className="text-2xl font-bold mr-2">{analytics.userSatisfaction}%</p>
                  <div className="flex-1">
                    <Progress value={analytics.userSatisfaction} className="h-2 bg-white/30" indicatorClassName="bg-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="ey-card h-full">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Chat with {agent.name}</h2>
                <p className="text-sm text-ey-lightGray">Specialized AI agent for {agent.name.toLowerCase()} tasks</p>
              </div>
              <div className="p-0">
                <AiChatInterface moduleContext={`agent-${agent.id}`} />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="ey-card h-full">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Agent Recommendations</h2>
              </div>
              <div className="p-4">
                {recommendations.length > 0 ? (
                  <ul className="space-y-4">
                    {recommendations.map((recommendation, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="flex"
                      >
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <p className="text-sm text-ey-darkGray">{recommendation}</p>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-ey-lightGray text-sm">No recommendations available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentChatPage;
