
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import ModuleCard from "../components/ModuleCard";
import KpiCard from "../components/KpiCard";
import { ArrowUpRight, BadgePlus, BarChart3, Bell, Factory, Globe, Package, Truck, AlertTriangle, Newspaper } from "lucide-react";
import AreaChart from "../components/AreaChart";
import { Button } from "@/components/ui/button";
import AiInsights from "../components/AiInsights";
import AiAgentsDeployment from "../components/AiAgentsDeployment";
import { getKpis, getAiInsights, getChartData, getLatestNews } from "../services/dataService";
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

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
}

const Index = () => {
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setKpisLoading(true);
        const kpiData = await getKpis();
        const typedKpiData = kpiData.map((kpi: any) => ({
          ...kpi,
          chart: Array.isArray(kpi.chart) ? kpi.chart.map((val: any) => Number(val)) : []
        }));
        setKpis(typedKpiData as KpiData[]);
        setKpisLoading(false);
        
        setInsightsLoading(true);
        const insightData = await getAiInsights();
        setInsights(insightData);
        setInsightsLoading(false);
        
        setChartLoading(true);
        const chartData = await getChartData('production');
        setProductionData(chartData);
        setChartLoading(false);
        
        setNewsLoading(true);
        const newsData = await getLatestNews();
        setLatestNews(newsData);
        setNewsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setKpisLoading(false);
        setInsightsLoading(false);
        setChartLoading(false);
        setNewsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const topKpis = kpis.slice(0, 3);
  
  const modules = [
    { 
      id: '1', 
      title: 'Demand Planning', 
      path: '/demand-planning', 
      completed: 82,
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      description: 'Forecast demand and plan production schedules with AI-driven insights.' 
    },
    { 
      id: '2', 
      title: 'Supply Planning', 
      path: '/supply-planning', 
      completed: 68,
      icon: <Globe className="h-5 w-5 text-green-600" />,
      description: 'Optimize your supply chain with predictive analytics and real-time monitoring.' 
    },
    { 
      id: '3', 
      title: 'Factory Planning', 
      path: '/factory-planning', 
      completed: 95,
      icon: <Factory className="h-5 w-5 text-purple-600" />,
      description: 'Streamline production workflows and maximize operational efficiency.' 
    },
    { 
      id: '4', 
      title: 'Inventory Optimization', 
      path: '/inventory-optimization', 
      completed: 74,
      icon: <Package className="h-5 w-5 text-orange-600" />,
      description: 'Balance inventory levels to reduce costs while maintaining service levels.' 
    },
    { 
      id: '5', 
      title: 'Logistics', 
      path: '/logistics', 
      completed: 88,
      icon: <Truck className="h-5 w-5 text-cyan-600" />,
      description: 'Plan transportation and distribution to minimize costs and delivery times.' 
    },
    { 
      id: '6', 
      title: 'Risk Management', 
      path: '/risk-management', 
      completed: 61,
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      description: 'Identify and mitigate supply chain risks before they impact your business.' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="lg:ml-64 ml-20 transition-all duration-300" data-main-content>
        <Header pageTitle="Dashboard" />
        <main className="p-6 space-y-6">
          <EyCoPilot />
          
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
                <KpiCard id="loading-1" title="Loading..." value="--" change={0} trend="flat" sparklineData={[0, 0, 0, 0, 0]} />
                <KpiCard id="loading-2" title="Loading..." value="--" change={0} trend="flat" sparklineData={[0, 0, 0, 0, 0]} />
                <KpiCard id="loading-3" title="Loading..." value="--" change={0} trend="flat" sparklineData={[0, 0, 0, 0, 0]} />
              </>
            ) : (
              topKpis.map(kpi => (
                <KpiCard 
                  key={kpi.id}
                  id={kpi.id}
                  title={kpi.title}
                  value={kpi.value}
                  change={parseFloat(kpi.change)}
                  trend={kpi.trend}
                  sparklineData={kpi.chart}
                />
              ))
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    key={module.id}
                    title={module.title}
                    path={module.path}
                    completed={module.completed.toString()}
                    icon={module.icon}
                    description={module.description}
                  />
                ))}
              </div>
            </div>
            
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
                    />
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-ey-darkGray">Latest Industry News</h2>
                <Link to="/news">
                  <Button variant="ghost" className="text-ey-darkGray flex items-center">
                    <Newspaper className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </Link>
              </div>
              
              <Card>
                <CardContent className="p-4 space-y-4">
                  {newsLoading ? (
                    <>
                      <div className="h-20 bg-gray-100 animate-pulse rounded-md mb-4"></div>
                      <div className="h-20 bg-gray-100 animate-pulse rounded-md mb-4"></div>
                      <div className="h-20 bg-gray-100 animate-pulse rounded-md"></div>
                    </>
                  ) : (
                    <>
                      {latestNews.slice(0, 3).map((news) => (
                        <div key={news.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                          <h3 className="font-medium text-ey-darkGray hover:text-blue-600 transition-colors">
                            <a href={news.url} target="_blank" rel="noopener noreferrer">
                              {news.title}
                            </a>
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{news.summary}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">{news.source}</span>
                            <span className="text-xs text-gray-400">{news.publishedAt}</span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2">
                        <Link to="/news" className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                          See all industry news
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <AiAgentsDeployment />
              </div>
            </div>
            
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
