
import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';

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
        return <Lightbulb className="h-5 w-5 text-ey-yellow" />;
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
        return 'bg-ey-yellow/10';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="ey-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-ey-darkGray font-medium">AI Insights</h3>
        <button className="text-sm text-ey-yellow hover:underline">View All</button>
      </div>
      
      <div className="space-y-4 stagger-animate">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`p-4 rounded-lg border ${getBgColor(insight.type)} border-${insight.type === 'suggestion' ? 'ey-yellow/20' : insight.type === 'alert' ? 'red-100' : insight.type === 'success' ? 'green-100' : 'blue-100'}`}
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
        ))}
      </div>
    </div>
  );
};

export default AiInsights;
