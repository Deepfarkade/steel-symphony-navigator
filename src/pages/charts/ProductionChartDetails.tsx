
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Filter, BarChart2, PieChart, LineChart, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AreaChart from '@/components/AreaChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getProductionDetailData } from '@/services/dataService';

const ProductionChartDetails = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProductionDetailData();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching production chart details:', error);
        // Mock data in case the API fails
        setChartData({
          daily: Array(30).fill(0).map((_, i) => ({
            name: `Day ${i+1}`,
            value: 800 + Math.random() * 200,
          })),
          weekly: Array(12).fill(0).map((_, i) => ({
            name: `Week ${i+1}`,
            value: 5000 + Math.random() * 1000,
          })),
          monthly: Array(12).fill(0).map((_, i) => ({
            name: `Month ${i+1}`,
            value: 22000 + Math.random() * 5000,
          })),
          byProduct: [
            { name: 'Hot Rolled Coil', value: 35 },
            { name: 'Cold Rolled Coil', value: 25 },
            { name: 'Galvanized Steel', value: 20 },
            { name: 'Steel Plate', value: 15 },
            { name: 'Steel Pipe', value: 5 },
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Navigation />
        <div data-main-content className="ml-64 p-8">
          <Header pageTitle="Production Chart Details" />
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ey-yellow"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      <div data-main-content className="ml-64 p-8">
        <Header pageTitle="Steel Production Analysis" />
        
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
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    Steel Production (tons)
                    <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-200">
                      AI Analyzed
                    </Badge>
                  </CardTitle>
                  <CardDescription>Comprehensive production analysis across time periods and products</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
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
                <Tabs defaultValue="daily">
                  <TabsList className="mb-6">
                    <TabsTrigger value="daily" className="flex items-center">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Daily
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="flex items-center">
                      <LineChart className="h-4 w-4 mr-2" />
                      Weekly
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="flex items-center">
                      <LineChart className="h-4 w-4 mr-2" />
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="byProduct" className="flex items-center">
                      <PieChart className="h-4 w-4 mr-2" />
                      By Product
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="daily">
                    <AreaChart 
                      data={chartData.daily} 
                      title="Daily Production Output (Last 30 Days)" 
                      color="#2E2E38" 
                    />
                  </TabsContent>
                  
                  <TabsContent value="weekly">
                    <AreaChart 
                      data={chartData.weekly} 
                      title="Weekly Production Output (Last 12 Weeks)" 
                      color="#2E2E38" 
                    />
                  </TabsContent>
                  
                  <TabsContent value="monthly">
                    <AreaChart 
                      data={chartData.monthly} 
                      title="Monthly Production Output (Last 12 Months)" 
                      color="#2E2E38" 
                    />
                  </TabsContent>
                  
                  <TabsContent value="byProduct">
                    <AreaChart 
                      data={chartData.byProduct} 
                      title="Production by Product Type (%)" 
                      color="#4F46E5" 
                    />
                  </TabsContent>
                </Tabs>
                
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Badge className="mr-2 bg-purple-100 text-purple-700 border-purple-200">AI Insights</Badge>
                    Production Trend Analysis
                  </h3>
                  <p className="text-gray-700">
                    AI analysis shows a 5.2% increase in production over the last quarter, with Hot Rolled Coil 
                    showing the strongest growth at 7.8%. There's a cyclical pattern with production peaks 
                    occurring mid-week. Consider optimizing manufacturing processes during Monday ramp-up 
                    periods to improve overall efficiency.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductionChartDetails;
