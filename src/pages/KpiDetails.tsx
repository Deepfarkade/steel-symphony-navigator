
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, Filter, BarChart, LineChart, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AreaChart from '@/components/AreaChart';
import { getKpiDetailData } from '@/services/dataService';

const KpiDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('trends');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getKpiDetailData(id || '');
        setKpiData(data);
      } catch (error) {
        console.error('Error fetching KPI details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navigation />
        <div data-main-content className="ml-64 p-8">
          <Header pageTitle="KPI Details" />
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ey-yellow"></div>
          </div>
        </div>
      </div>
    );
  }

  // Mock data in case the API fails
  const mockData = {
    id: id,
    title: id === 'production-yield' 
      ? 'Production Yield' 
      : id === 'energy-consumption' 
        ? 'Energy Consumption' 
        : id === 'quality-rating' 
          ? 'Quality Rating' 
          : 'On-Time Delivery',
    currentValue: id === 'production-yield' 
      ? '94.8%' 
      : id === 'energy-consumption' 
        ? '1,235 MWh' 
        : id === 'quality-rating' 
          ? 'A+' 
          : '92.3%',
    change: id === 'production-yield' 
      ? 2.3 
      : id === 'energy-consumption' 
        ? -5.7 
        : id === 'quality-rating' 
          ? 1.2 
          : -0.8,
    trendData: Array(12).fill(0).map((_, i) => ({
      name: `Week ${i+1}`,
      value: 75 + Math.random() * 20,
    })),
    breakdownData: Array(5).fill(0).map((_, i) => ({
      name: `Category ${i+1}`,
      value: 10 + Math.random() * 30,
    })),
    forecastData: Array(6).fill(0).map((_, i) => ({
      name: `Month ${i+1}`,
      value: 80 + (Math.random() * 15),
      forecast: true,
    })),
    description: `Detailed analysis and insights for ${id?.replace('-', ' ')} across all steel manufacturing operations.`
  };

  const data = kpiData || mockData;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      <div data-main-content className="ml-64 p-8">
        <Header pageTitle={data.title} />
        
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-2xl font-bold">{data.title}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last 30 Days
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline mb-6">
                  <h3 className="text-4xl font-bold">{data.currentValue}</h3>
                  <span className={`ml-2 text-sm font-medium px-2 py-1 rounded ${
                    data.change >= 0 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-red-700 bg-red-100'
                  }`}>
                    {data.change >= 0 ? '+' : ''}{data.change}%
                  </span>
                </div>
                
                <p className="text-gray-600 mb-8">{data.description}</p>
                
                <Tabs defaultValue="trends" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="trends" className="flex items-center">
                      <LineChart className="h-4 w-4 mr-2" />
                      Trends
                    </TabsTrigger>
                    <TabsTrigger value="breakdown" className="flex items-center">
                      <PieChart className="h-4 w-4 mr-2" />
                      Breakdown
                    </TabsTrigger>
                    <TabsTrigger value="forecast" className="flex items-center">
                      <BarChart className="h-4 w-4 mr-2" />
                      Forecast
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="trends">
                    <AreaChart 
                      data={data.trendData} 
                      title="Historical Trend" 
                      color="#2E2E38" 
                      height={400}
                    />
                  </TabsContent>
                  
                  <TabsContent value="breakdown">
                    <AreaChart 
                      data={data.breakdownData} 
                      title="Category Breakdown" 
                      color="#FFE600" 
                      height={400}
                    />
                  </TabsContent>
                  
                  <TabsContent value="forecast">
                    <AreaChart 
                      data={data.forecastData} 
                      title="Future Forecast (AI Generated)" 
                      color="#4F46E5" 
                      height={400}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default KpiDetails;
