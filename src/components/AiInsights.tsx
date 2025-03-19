
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { getAiInsights } from '@/services/dataService';

interface Insight {
  id: number;
  type: 'alert' | 'success' | 'opportunity' | 'suggestion';
  message: string;
  timestamp: string;
}

interface AiInsightsProps {
  insights?: Insight[];
  loading?: boolean;
}

const AiInsights: React.FC<AiInsightsProps> = ({ insights: propInsights, loading: propLoading }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(propLoading || false);

  useEffect(() => {
    if (propInsights && propInsights.length > 0) {
      setInsights(propInsights);
    } else {
      const fetchInsights = async () => {
        setLoading(true);
        try {
          const data = await getAiInsights();
          setInsights(data);
        } catch (error) {
          console.error('Error fetching AI insights:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchInsights();
    }
  }, [propInsights]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-50';
      case 'success':
        return 'bg-green-50';
      case 'opportunity':
        return 'bg-blue-50';
      case 'suggestion':
        return 'bg-purple-100';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="ey-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-ey-darkGray font-medium">AI Insights</h3>
        <Link to="/analytics">
          <Button variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50">View All</Button>
        </Link>
      </div>
      
      <div className="space-y-4 stagger-animate">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="animate-pulse p-4 rounded-lg bg-gray-100">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="w-full">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : insights && insights.length > 0 ? (
          insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-4 rounded-lg border ${getBgColor(insight.type)} border-${insight.type === 'suggestion' ? 'purple-200' : insight.type === 'alert' ? 'red-100' : insight.type === 'success' ? 'green-100' : 'blue-100'}`}
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  {getIcon(insight.type)}
                </div>
                <div>
                  <p className="text-ey-darkGray">{insight.message}</p>
                  <p className="text-xs text-ey-lightGray mt-1">{insight.timestamp}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-ey-lightGray">
            <p>No AI insights available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInsights;
