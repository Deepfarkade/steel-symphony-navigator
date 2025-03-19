
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { getAiInsights } from '@/services/dataService';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [loading, setLoading] = useState(propLoading !== undefined ? propLoading : true);

  useEffect(() => {
    if (propInsights) {
      // Ensure data conforms to Insight type
      const typedInsights = propInsights.map(item => ({
        ...item,
        type: item.type as 'alert' | 'success' | 'opportunity' | 'suggestion'
      }));
      setInsights(typedInsights);
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        const data = await getAiInsights();
        // Ensure data conforms to Insight type
        const typedData = data.map(item => ({
          ...item,
          type: item.type as 'alert' | 'success' | 'opportunity' | 'suggestion'
        }));
        setInsights(typedData);
      } catch (error) {
        console.error('Error fetching AI insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
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

  const formatInsights = (insightsData: any[]): Insight[] => {
    if (!Array.isArray(insightsData) || insightsData.length === 0) {
      return [];
    }
    
    return insightsData.map((insight, index) => {
      if (typeof insight === 'object' && insight.id && insight.type && insight.message) {
        return {
          ...insight,
          type: insight.type as 'alert' | 'success' | 'opportunity' | 'suggestion',
          timestamp: insight.timestamp || new Date().toISOString()
        };
      }
      
      // Default type based on index if not specified
      const defaultType = index % 4 === 0 ? 'alert' : 
                        index % 4 === 1 ? 'success' : 
                        index % 4 === 2 ? 'opportunity' : 'suggestion';
      
      return {
        id: typeof insight.id === 'number' ? insight.id : index + 1,
        type: (insight.type || defaultType) as 'alert' | 'success' | 'opportunity' | 'suggestion',
        message: typeof insight === 'string' ? insight : insight.message || `AI insight ${index + 1}`,
        timestamp: insight.timestamp || new Date().toISOString()
      };
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formattedInsights = formatInsights(insights);

  return (
    <div className="ey-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-ey-darkGray font-medium">AI Insights</h3>
        <Link to="/analytics">
          <Button variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 flex items-center">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4 stagger-animate">
        {loading ? (
          <>
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </>
        ) : formattedInsights.length > 0 ? (
          formattedInsights.map((insight) => (
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
                  <p className="text-xs text-ey-lightGray mt-1">{formatTime(insight.timestamp)}</p>
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
