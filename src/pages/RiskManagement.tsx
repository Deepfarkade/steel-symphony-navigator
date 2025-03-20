
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, TrendingDown } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';
import { getRiskAssessmentData } from '../services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Define types for risk data
interface RiskCategory {
  name: string;
  score: number;
}

interface KeyRisk {
  id: number;
  title: string;
  impact: string;
  probability: string;
  category: string;
  mitigation: string;
}

interface RiskAssessmentData {
  overallRiskScore: number;
  riskCategories: RiskCategory[];
  keyRisks: KeyRisk[];
  riskTrends: { month: string; score: number }[];
}

const RiskManagement = () => {
  const { insights, isLoading: insightsLoading } = useModuleInsights('risk-management');
  const [riskData, setRiskData] = useState<RiskAssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure page starts at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        setIsLoading(true);
        // This will use our centralized API configuration when connected to backend
        const data = await getRiskAssessmentData();
        setRiskData(data);
      } catch (error) {
        console.error('Error fetching risk data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRiskData();
  }, []);
  
  const getRiskColor = (score: number) => {
    if (score >= 75) return "text-red-600";
    if (score >= 50) return "text-amber-600";
    return "text-green-600";
  };
  
  const getRiskProgressColor = (score: number) => {
    if (score >= 75) return "bg-red-600";
    if (score >= 50) return "bg-amber-600";
    return "bg-green-600";
  };
  
  return (
    <ModuleLayout
      title="Risk Management"
      description="Steel supply chain risk identification and proactive mitigation recommendations"
      icon={<AlertTriangle className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Risk Management" isLoading={insightsLoading || isLoading}>
        {!isLoading && riskData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overall Risk Score */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-amber-500" />
                  Overall Risk Score
                </CardTitle>
                <CardDescription>Current supply chain risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getRiskColor(riskData.overallRiskScore)}`}>
                    {riskData.overallRiskScore}%
                  </div>
                  <Progress
                    value={riskData.overallRiskScore}
                    className="h-2 mt-2"
                    indicatorClassName={getRiskProgressColor(riskData.overallRiskScore)}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {riskData.overallRiskScore >= 75 
                      ? 'High Risk: Immediate attention required' 
                      : riskData.overallRiskScore >= 50 
                        ? 'Moderate Risk: Monitor closely' 
                        : 'Low Risk: Continue regular monitoring'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Risk Categories */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-amber-500" />
                  Risk Categories
                </CardTitle>
                <CardDescription>Breakdown by risk type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskData.riskCategories.map((category, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className={`text-sm font-medium ${getRiskColor(category.score)}`}>
                          {category.score}%
                        </span>
                      </div>
                      <Progress
                        value={category.score}
                        className="h-2"
                        indicatorClassName={getRiskProgressColor(category.score)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Key Risks */}
            <Card className="col-span-1 md:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Key Risks
                </CardTitle>
                <CardDescription>Top risks requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Risk</th>
                        <th className="text-left py-3 px-4 font-medium">Category</th>
                        <th className="text-left py-3 px-4 font-medium">Impact</th>
                        <th className="text-left py-3 px-4 font-medium">Probability</th>
                        <th className="text-left py-3 px-4 font-medium">Mitigation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskData.keyRisks.map((risk) => (
                        <tr key={risk.id} className="border-b">
                          <td className="py-3 px-4 font-medium">{risk.title}</td>
                          <td className="py-3 px-4">{risk.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              risk.impact === 'High' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                : risk.impact === 'Medium' 
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {risk.impact}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              risk.probability === 'High' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                : risk.probability === 'Medium' 
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {risk.probability}
                            </span>
                          </td>
                          <td className="py-3 px-4">{risk.mitigation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </ModuleContent>
    </ModuleLayout>
  );
};

export default RiskManagement;
