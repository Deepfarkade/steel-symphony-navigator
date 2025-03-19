
import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface Insight {
  id: number;
  type: 'alert' | 'success' | 'opportunity' | 'suggestion';
  message: string;
  timestamp: string;
}

interface AiInsightsProps {
  insights: Insight[];
}

const AiInsights: React.FC<AiInsightsProps> = ({ insights }) => {
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

  // Map the strings to actual Insight objects
  const formattedInsights: Insight[] = Array.isArray(insights) 
    ? insights.map((insight, index) => {
        // If insight is already an Insight object, return it
        if (typeof insight === 'object' && insight.id) {
          return insight;
        }
        
        // If insight is a string, convert it to an Insight object
        return {
          id: index + 1,
          type: index % 4 === 0 ? 'alert' : 
                index % 4 === 1 ? 'success' : 
                index % 4 === 2 ? 'opportunity' : 'suggestion',
          message: typeof insight === 'string' ? insight : `AI insight ${index + 1}`,
          timestamp: new Date().toLocaleString()
        };
      })
    : [];

  return (
    <div className="ey-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-ey-darkGray font-medium">AI Insights</h3>
        <Link to="/analytics">
          <Button variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50">View All</Button>
        </Link>
      </div>
      
      <div className="space-y-4 stagger-animate">
        {formattedInsights.length > 0 ? (
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
