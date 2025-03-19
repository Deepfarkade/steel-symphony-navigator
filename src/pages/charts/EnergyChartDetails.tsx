
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Zap, PieChart, LineChart, Calendar, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';
import AreaChart from '@/components/AreaChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getEnergyDetailData } from '@/services/dataService';

const EnergyChartDetails = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getEnergyDetailData();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching energy chart details:', error);
        // Mock data in case the API fails
        setChartData({
          daily: Array(30).fill(0).map((_, i) => ({
            name: `Day ${i+1}`,
            value: 30 + Math.random() * 15,
          })),
          weekly: Array(12).fill(0).map((_, i) => ({
            name: `Week ${i+1}`,
            value: 200 + Math.random() * 50,
          })),
          monthly: Array(12).fill(0).map((_, i) => ({
            name: `Month ${i+1}`,
            value: 900 + Math.random() * 200,
          })),
          byProcess: [
            { name: 'Blast Furnace', value: 40 },
            { name: 'Rolling Mill', value: 25 },
            { name: 'Heat Treatment', value: 20 },
            { name: 'Coating Lines', value: 10 },
            { name: 'Auxiliary Processes', value: 5 },
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
          <Header pageTitle="Energy Consumption Details" />
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
        <Header pageTitle="Energy Consumption Analysis" />
        
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
                    Energy Consumption (MWh)
                    <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-600 border-amber-200">
                      AI Optimized
                    </Badge>
                  </CardTitle>
                  <CardDescription>Energy usage analysis across time periods and production processes</CardDescription>
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
                    <TabsTrigger value="byProcess" className="flex items-center">
                      <PieChart className="h-4 w-4 mr-2" />
                      By Process
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="daily">
                    <AreaChart 
                      data={chartData.daily} 
                      title="Daily Energy Consumption (Last 30 Days)" 
                      color="#FFE600" 
                      height={500}
                    />
                  </TabsContent>
                  
                  <TabsContent value="weekly">
                    <AreaChart 
                      data={chartData.weekly} 
                      title="Weekly Energy Consumption (Last 12 Weeks)" 
                      color="#FFE600" 
                      height={500}
                    />
                  </TabsContent>
                  
                  <TabsContent value="monthly">
                    <AreaChart 
                      data={chartData.monthly} 
                      title="Monthly Energy Consumption (Last 12 Months)" 
                      color="#FFE600" 
                      height={500}
                    />
                  </TabsContent>
                  
                  <TabsContent value="byProcess">
                    <AreaChart 
                      data={chartData.byProcess} 
                      title="Energy Consumption by Process (%)" 
                      color="#4F46E5" 
                      height={500}
                    />
                  </TabsContent>
                </Tabs>
                
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Badge className="mr-2 bg-green-100 text-green-700 border-green-200">AI Recommendations</Badge>
                    Energy Efficiency Improvements
                  </h3>
                  <p className="text-gray-700">
                    AI analysis shows a 5.7% decrease in energy consumption per ton of steel produced this quarter.
                    Further optimization potential identified in the blast furnace operations during night shifts.
                    Implementing predictive maintenance for rolling mills could reduce energy peaks by an estimated 3.8%.
                    Consider transitioning auxiliary processes to renewable energy sources for potential 12% reduction in carbon footprint.
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

export default EnergyChartDetails;
