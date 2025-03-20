
import React from 'react';
import { Zap, BarChart2, Brain, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAiMetrics } from '@/hooks/useAiMetrics';

interface AiDashboardProps {
  title: string;
  module: string;
}

const AiDashboard: React.FC<AiDashboardProps> = ({ title, module }) => {
  const metrics = useAiMetrics(module);

  return (
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
  );
};

export default AiDashboard;
