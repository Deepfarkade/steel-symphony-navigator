
import React, { useState, ReactNode } from 'react';
import { LineChart, BarChart, Loader2, BrainCircuit, Zap, Sparkles, Bot } from 'lucide-react';
import { generateAIResponse } from '../services/aiService';
import { toast } from "sonner";

interface ModuleContentProps {
  isLoading?: boolean;
  moduleType: string;
  children?: ReactNode;
}

const ModuleContent: React.FC<ModuleContentProps> = ({ isLoading = false, moduleType, children }) => {
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportResult, setReportResult] = useState<string | null>(null);
  
  const handleGenerateAIReport = async () => {
    setGeneratingReport(true);
    setReportResult(null);
    
    try {
      // Call the AI service to generate a response
      const prompt = `Generate a comprehensive analysis for ${moduleType} in a steel manufacturing context`;
      const response = await generateAIResponse(prompt, moduleType);
      
      // Short timeout to simulate more complex processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReportResult(response.text);
      toast.success("AI Report generated successfully!");
    } catch (error) {
      console.error("Error generating AI report:", error);
      toast.error("Failed to generate AI report. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  };

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
      {children}
      
      <div className="ey-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BrainCircuit className="h-6 w-6 text-ey-yellow mr-2" />
            <h2 className="text-lg font-medium text-ey-darkGray">{moduleType} AI Dashboard</h2>
          </div>
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 text-ey-yellow mr-1 animate-pulse" />
            <span className="text-xs bg-ey-yellow/20 text-ey-darkGray px-2 py-1 rounded-full">
              Powered by EY Co-Pilot
            </span>
          </div>
        </div>
        
        <p className="text-ey-lightGray mb-6">
          This AI-powered dashboard provides real-time insights and analytics for your {moduleType.toLowerCase()} operations through EY's generative AI technology.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-ey-darkGray/5 p-4 rounded-lg border border-ey-darkGray/10 hover:bg-ey-darkGray/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-ey-darkGray">AI-Generated Key Metrics</h3>
              <LineChart className="h-5 w-5 text-ey-yellow" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-ey-lightGray">AI Prediction Accuracy</span>
                <span className="text-ey-darkGray font-medium">94.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ey-lightGray">Decision Confidence</span>
                <span className="text-ey-darkGray font-medium">97.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ey-lightGray">Optimization Potential</span>
                <span className="text-ey-darkGray font-medium">86.5%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-ey-darkGray/5 p-4 rounded-lg border border-ey-darkGray/10 hover:bg-ey-darkGray/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-ey-darkGray">AI Model Performance</h3>
              <BarChart className="h-5 w-5 text-ey-yellow" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-ey-lightGray">Pattern Recognition</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-ey-yellow h-2.5 rounded-full animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '85%' }}></div>
                </div>
                <span className="text-ey-darkGray text-sm">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ey-lightGray">Anomaly Detection</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-ey-darkGray h-2.5 rounded-full animate-[pulse_2.5s_ease-in-out_infinite]" style={{ width: '90%' }}></div>
                </div>
                <span className="text-ey-darkGray text-sm">90%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ey-lightGray">Predictive Power</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full animate-[pulse_2.7s_ease-in-out_infinite]" style={{ width: '78%' }}></div>
                </div>
                <span className="text-ey-darkGray text-sm">78%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-ey-yellow/5 p-4 rounded-lg border border-ey-yellow/20">
          <div className="flex items-center mb-3">
            <Sparkles className="h-5 w-5 text-ey-yellow mr-2" />
            <h3 className="font-medium text-ey-darkGray">AI-Generated Recommendations</h3>
          </div>
          <ul className="list-disc list-inside space-y-2 text-ey-lightGray pl-2">
            <li>Optimize {moduleType.toLowerCase()} schedule based on machine learning patterns from historical data</li>
            <li>AI has identified potential efficiencies in your supply chain through advanced pattern recognition</li>
            <li>Implement the predictive maintenance schedule generated by our neural network analysis</li>
            <li>Our generative models suggest adjusting inventory levels based on detected seasonal patterns</li>
          </ul>
        </div>
      </div>
      
      <div className="ey-card p-6">
        <div className="flex items-center mb-4">
          <Bot className="h-6 w-6 text-ey-yellow mr-2" />
          <h2 className="text-lg font-medium text-ey-darkGray">AI-Powered {moduleType} Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            className="p-4 border border-ey-yellow/20 rounded-lg bg-ey-yellow/5 text-ey-darkGray hover:bg-ey-yellow/10 transition-colors text-left flex group relative overflow-hidden"
            onClick={handleGenerateAIReport}
            disabled={generatingReport}
          >
            <div className="rounded-full p-2 bg-ey-yellow/10 mr-3 group-hover:bg-ey-yellow/20 transition-colors">
              <Zap className="h-5 w-5 text-ey-yellow" />
            </div>
            <div className="z-10">
              <h3 className="font-medium mb-1">Generate AI Report</h3>
              <p className="text-sm text-ey-lightGray">LLM-generated comprehensive analysis of your operations</p>
            </div>
            <div className="absolute inset-0 bg-ey-yellow/0 group-hover:bg-ey-yellow/5 transition-colors"></div>
          </button>
          
          <button className="p-4 border border-ey-yellow/20 rounded-lg bg-ey-yellow/5 text-ey-darkGray hover:bg-ey-yellow/10 transition-colors text-left flex group relative overflow-hidden">
            <div className="rounded-full p-2 bg-ey-yellow/10 mr-3 group-hover:bg-ey-yellow/20 transition-colors">
              <BrainCircuit className="h-5 w-5 text-ey-yellow" />
            </div>
            <div className="z-10">
              <h3 className="font-medium mb-1">AI Strategy Optimization</h3>
              <p className="text-sm text-ey-lightGray">Neural network suggestions to improve current approach</p>
            </div>
            <div className="absolute inset-0 bg-ey-yellow/0 group-hover:bg-ey-yellow/5 transition-colors"></div>
          </button>
          
          <button className="p-4 border border-ey-yellow/20 rounded-lg bg-ey-yellow/5 text-ey-darkGray hover:bg-ey-yellow/10 transition-colors text-left flex group relative overflow-hidden">
            <div className="rounded-full p-2 bg-ey-yellow/10 mr-3 group-hover:bg-ey-yellow/20 transition-colors">
              <LineChart className="h-5 w-5 text-ey-yellow" />
            </div>
            <div className="z-10">
              <h3 className="font-medium mb-1">Predictive AI Analysis</h3>
              <p className="text-sm text-ey-lightGray">Machine learning forecasts based on your historical data</p>
            </div>
            <div className="absolute inset-0 bg-ey-yellow/0 group-hover:bg-ey-yellow/5 transition-colors"></div>
          </button>
          
          <button className="p-4 border border-ey-yellow/20 rounded-lg bg-ey-yellow/5 text-ey-darkGray hover:bg-ey-yellow/10 transition-colors text-left flex group relative overflow-hidden">
            <div className="rounded-full p-2 bg-ey-yellow/10 mr-3 group-hover:bg-ey-yellow/20 transition-colors">
              <Sparkles className="h-5 w-5 text-ey-yellow" />
            </div>
            <div className="z-10">
              <h3 className="font-medium mb-1">AI Risk Assessment</h3>
              <p className="text-sm text-ey-lightGray">Generative AI identification of potential operational risks</p>
            </div>
            <div className="absolute inset-0 bg-ey-yellow/0 group-hover:bg-ey-yellow/5 transition-colors"></div>
          </button>
        </div>
        
        {reportResult && (
          <div className="mt-8 p-6 bg-ey-darkGray/5 border border-ey-darkGray/10 rounded-lg animate-fade-in">
            <div className="flex items-center mb-4">
              <BrainCircuit className="h-5 w-5 text-ey-yellow mr-2" />
              <h3 className="font-medium text-ey-darkGray">AI-Generated Report for {moduleType}</h3>
            </div>
            <p className="text-ey-lightGray whitespace-pre-line">{reportResult}</p>
          </div>
        )}
        
        {generatingReport && (
          <div className="mt-8 p-6 bg-ey-darkGray/5 border border-ey-darkGray/10 rounded-lg animate-pulse flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-ey-yellow animate-spin mr-4" />
            <div>
              <h3 className="font-medium text-ey-darkGray">Generating AI Report</h3>
              <p className="text-sm text-ey-lightGray">Our LLM is analyzing your {moduleType.toLowerCase()} data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleContent;
