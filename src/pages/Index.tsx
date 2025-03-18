
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import ModuleCard from "../components/ModuleCard";
import KpiCard from "../components/KpiCard";
import { ArrowUpRight, BadgePlus, BarChart3, Bell } from "lucide-react";
import AreaChart from "../components/AreaChart";
import { Button } from "@/components/ui/button";
import AiInsights from "../components/AiInsights";
import AiAgentsDeployment from "../components/AiAgentsDeployment";
import { getKpis, getAiInsights, getChartData } from "../services/dataService";
import EyCoPilot from '../components/EyCoPilot';

interface KpiData {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
  chart: number[];
  module: string;
}

const Index = () => {
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch KPIs
        setKpisLoading(true);
        const kpiData = await getKpis();
        setKpis(kpiData);
        setKpisLoading(false);
        
        // Fetch Insights
        setInsightsLoading(true);
        const insightData = await getAiInsights();
        setInsights(insightData);
        setInsightsLoading(false);
        
        // Fetch Chart Data
        setChartLoading(true);
        const chartData = await getChartData('production');
        setProductionData(chartData);
        setChartLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setKpisLoading(false);
        setInsightsLoading(false);
        setChartLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Get top KPIs
  const topKpis = kpis.slice(0, 3);
  
  const modules = [
    { name: 'Demand Planning', path: '/demand-planning', completed: '82%', icon: 'bar-chart-2' },
    { name: 'Supply Planning', path: '/supply-planning', completed: '68%', icon: 'globe' },
    { name: 'Factory Planning', path: '/factory-planning', completed: '95%', icon: 'factory' },
    { name: 'Inventory Optimization', path: '/inventory-optimization', completed: '74%', icon: 'package' },
    { name: 'Logistics', path: '/logistics', completed: '88%', icon: 'truck' },
    { name: 'Risk Management', path: '/risk-management', completed: '61%', icon: 'alert-triangle' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:ml-64 ml-20 transition-all duration-300" data-main-content>
        <Header title="Dashboard" />
        <main className="p-6 space-y-6">
          {/* EY Co-Pilot Section */}
          <EyCoPilot />
          
          {/* KPIs Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-1">
            <h2 className="text-xl font-semibold text-ey-darkGray">Key Performance Indicators</h2>
            <Link to="/analytics">
              <Button variant="ghost" className="text-ey-darkGray flex items-center">
                View all KPIs 
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpisLoading ? (
              <>
                <KpiCard loading />
                <KpiCard loading />
                <KpiCard loading />
              </>
            ) : (
              topKpis.map(kpi => (
                <KpiCard 
                  key={kpi.id}
                  id={kpi.id}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  trend={kpi.trend}
                  sparklineData={kpi.chart}
                />
              ))
            )}
          </div>
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Modules Column */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-ey-darkGray">Planning Modules</h2>
                <Button variant="ghost" className="text-ey-darkGray">
                  <BadgePlus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {modules.map((module) => (
                  <ModuleCard
                    key={module.name}
                    name={module.name}
                    path={module.path}
                    completed={module.completed}
                    icon={module.icon}
                  />
                ))}
              </div>
            </div>
            
            {/* Production Chart Column */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-ey-darkGray">Steel Production</h2>
                <Link to="/charts/production">
                  <Button variant="ghost" className="text-ey-darkGray flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </Link>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {chartLoading ? (
                    <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md"></div>
                  ) : (
                    <AreaChart 
                      data={productionData} 
                      color="#5850BB" 
                      title="Steel Production (tons)" 
                      height={300}
                    />
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-ey-darkGray">AI Agents</h2>
                <AiAgentsDeployment />
              </div>
            </div>
            
            {/* AI Insights Column */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-ey-darkGray">AI Powered Insights</h2>
                <Link to="/notifications">
                  <Button variant="ghost" className="text-ey-darkGray flex items-center">
                    <Bell className="h-4 w-4 mr-1" />
                    Alerts
                  </Button>
                </Link>
              </div>
              
              <AiInsights insights={insights} loading={insightsLoading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
