
import React from 'react';
import { Brain, LightbulbIcon, TrendingUp, Sparkles, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ModuleInsight } from '../ModuleLayout';

interface ModuleInsightsPanelProps {
  title: string;
  insights: ModuleInsight[];
  isLoading: boolean;
}

const ModuleInsightsPanel: React.FC<ModuleInsightsPanelProps> = ({ title, insights, isLoading }) => {
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

  return (
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
  );
};

export default ModuleInsightsPanel;
