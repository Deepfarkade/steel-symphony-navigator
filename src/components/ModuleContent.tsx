
import React from 'react';
import { LineChart, BarChart, Loader2 } from 'lucide-react';

interface ModuleContentProps {
  isLoading?: boolean;
  moduleType: string;
}

const ModuleContent: React.FC<ModuleContentProps> = ({ isLoading = false, moduleType }) => {
  if (isLoading) {
    return (
      <div className="ey-card p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-ey-yellow mb-4" />
          <p className="text-ey-lightGray">Loading {moduleType} data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="ey-card p-6">
        <h2 className="text-lg font-medium text-ey-darkGray mb-4">{moduleType} Dashboard</h2>
        <p className="text-ey-lightGray mb-6">
          This AI-powered dashboard provides real-time insights and analytics for your {moduleType.toLowerCase()} operations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-ey-darkGray/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-ey-darkGray">Key Metrics</h3>
              <LineChart className="h-5 w-5 text-ey-yellow" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-ey-lightGray">Efficiency</span>
                <span className="text-ey-darkGray font-medium">94.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ey-lightGray">Accuracy</span>
                <span className="text-ey-darkGray font-medium">97.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ey-lightGray">Utilization</span>
                <span className="text-ey-darkGray font-medium">86.5%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-ey-darkGray/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-ey-darkGray">Performance</h3>
              <BarChart className="h-5 w-5 text-ey-yellow" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-ey-lightGray">Current</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-ey-yellow h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-ey-darkGray text-sm">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ey-lightGray">Target</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-ey-darkGray h-2.5 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <span className="text-ey-darkGray text-sm">90%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ey-lightGray">Industry</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <span className="text-ey-darkGray text-sm">78%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-ey-darkGray/5 p-4 rounded-lg">
          <h3 className="font-medium text-ey-darkGray mb-2">AI Recommendations</h3>
          <ul className="list-disc list-inside space-y-2 text-ey-lightGray">
            <li>Optimize {moduleType.toLowerCase()} schedule based on current market demand</li>
            <li>Review key supplier relationships to improve consistency in raw materials</li>
            <li>Implement predictive maintenance schedule for critical equipment</li>
            <li>Consider adjusting inventory levels based on seasonal demand patterns</li>
          </ul>
        </div>
      </div>
      
      <div className="ey-card p-6">
        <h2 className="text-lg font-medium text-ey-darkGray mb-4">AI-Powered {moduleType} Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-ey-yellow/20 rounded-lg bg-ey-yellow/5 text-ey-darkGray hover:bg-ey-yellow/10 transition-colors text-left">
            <h3 className="font-medium mb-1">Generate {moduleType} Report</h3>
            <p className="text-sm text-ey-lightGray">AI-generated comprehensive analysis of current operations</p>
          </button>
          
          <button className="p-4 border border-ey-yellow/20 rounded-lg bg-ey-yellow/5 text-ey-darkGray hover:bg-ey-yellow/10 transition-colors text-left">
            <h3 className="font-medium mb-1">Optimize {moduleType} Strategy</h3>
            <p className="text-sm text-ey-lightGray">Let AI suggest improvements to your current approach</p>
          </button>
          
          <button className="p-4 border border-ey-yellow/20 rounded-lg bg-ey-yellow/5 text-ey-darkGray hover:bg-ey-yellow/10 transition-colors text-left">
            <h3 className="font-medium mb-1">Predictive Analysis</h3>
            <p className="text-sm text-ey-lightGray">Forecast future trends based on historical data</p>
          </button>
          
          <button className="p-4 border border-ey-yellow/20 rounded-lg bg-ey-yellow/5 text-ey-darkGray hover:bg-ey-yellow/10 transition-colors text-left">
            <h3 className="font-medium mb-1">Risk Assessment</h3>
            <p className="text-sm text-ey-lightGray">Identify and quantify potential risks in your operations</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleContent;
