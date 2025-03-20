
import React, { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, ChevronDown, FileText, Download, RefreshCw, LineChart, PieChart } from 'lucide-react';
import ModuleLayout from '@/components/ModuleLayout';
import { useModuleInsights } from '@/hooks/useModuleInsights';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Legend,
  Bar
} from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

const data = [
  { name: 'Jan', actual: 4000, forecast: 3500, variance: -12.5 },
  { name: 'Feb', actual: 3700, forecast: 3600, variance: -2.7 },
  { name: 'Mar', actual: 4200, forecast: 4300, variance: 2.4 },
  { name: 'Apr', actual: 5100, forecast: 4800, variance: -5.9 },
  { name: 'May', actual: 4800, forecast: 5000, variance: 4.2 },
  { name: 'Jun', actual: 5500, forecast: 5200, variance: -5.5 },
  { name: 'Jul', actual: 5300, forecast: 5400, variance: 1.9 },
  { name: 'Aug', actual: 4900, forecast: 5100, variance: 4.1 },
  { name: 'Sep', actual: 5100, forecast: 5300, variance: 3.9 },
  { name: 'Oct', actual: 5400, forecast: 5500, variance: 1.9 },
  { name: 'Nov', actual: 5600, forecast: 5700, variance: 1.8 },
  { name: 'Dec', actual: 5800, forecast: 5500, variance: -5.2 }
];

const productData = [
  { name: 'Hot-Rolled Coil', forecast: 28500, accuracy: 94.2, trend: '+5.3%' },
  { name: 'Cold-Rolled Coil', forecast: 21800, accuracy: 96.1, trend: '+2.1%' },
  { name: 'Galvanized Steel', forecast: 19200, accuracy: 92.8, trend: '-1.7%' },
  { name: 'Steel Plates', forecast: 12500, accuracy: 90.5, trend: '+4.2%' },
  { name: 'Steel Rods', forecast: 9800, accuracy: 93.7, trend: '+0.5%' },
  { name: 'Structural Steel', forecast: 7500, accuracy: 91.9, trend: '-2.3%' }
];

const regionData = [
  { name: 'North America', value: 35, percentage: '35%' },
  { name: 'Europe', value: 25, percentage: '25%' },
  { name: 'Asia Pacific', value: 20, percentage: '20%' },
  { name: 'Latin America', value: 12, percentage: '12%' },
  { name: 'Middle East & Africa', value: 8, percentage: '8%' }
];

const DemandPlanning = () => {
  const { insights, isLoading } = useModuleInsights('demand-planning');
  const [timeframe, setTimeframe] = useState('monthly');
  const [productCategory, setProductCategory] = useState('all');
  const [isRunningForecast, setIsRunningForecast] = useState(false);
  
  const handleRunForecast = () => {
    setIsRunningForecast(true);
    toast({
      title: "Generating AI Forecast",
      description: "Processing market data and historical patterns..."
    });
    
    setTimeout(() => {
      setIsRunningForecast(false);
      toast({
        title: "AI Forecast Complete",
        description: "Demand forecast has been updated with latest projections.",
        variant: "success"
      });
    }, 3500);
  };
  
  return (
    <ModuleLayout
      title="Demand Planning"
      description="AI-powered demand forecasting and analytics for steel products"
      icon={<BarChart3 className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Demand Forecast Dashboard
                </CardTitle>
                <CardDescription>
                  AI-generated demand projections for the next 12 months
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleRunForecast}
                  disabled={isRunningForecast}
                >
                  {isRunningForecast ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Run AI Forecast
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Actual Demand (tons)"
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stackId="2"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Forecasted Demand (tons)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <div className="text-sm text-blue-600 font-medium">Forecast Accuracy</div>
                  <div className="text-2xl font-bold mt-1">94.3%</div>
                  <div className="text-xs text-gray-500 mt-1">+2.1% vs. previous quarter</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <div className="text-sm text-green-600 font-medium">Annual Growth</div>
                  <div className="text-2xl font-bold mt-1">+6.8%</div>
                  <div className="text-xs text-gray-500 mt-1">Year-over-year projected increase</div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50">
                <CardContent className="p-4">
                  <div className="text-sm text-amber-600 font-medium">Avg. Forecast Bias</div>
                  <div className="text-2xl font-bold mt-1">-1.2%</div>
                  <div className="text-xs text-gray-500 mt-1">Slight tendency to overforecast</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50">
                <CardContent className="p-4">
                  <div className="text-sm text-purple-600 font-medium">Market Share</div>
                  <div className="text-2xl font-bold mt-1">32.5%</div>
                  <div className="text-xs text-gray-500 mt-1">+0.8% increase in market position</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Product Category Forecasts
                  </CardTitle>
                  <Select defaultValue={productCategory} onValueChange={setProductCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="flat">Flat Products</SelectItem>
                      <SelectItem value="long">Long Products</SelectItem>
                      <SelectItem value="coated">Coated Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>
                  Forecast volume and accuracy by product line
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px] pr-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-3 font-medium text-gray-500">Product</th>
                        <th className="pb-3 font-medium text-gray-500 text-right">Forecast (tons)</th>
                        <th className="pb-3 font-medium text-gray-500 text-right">Accuracy</th>
                        <th className="pb-3 font-medium text-gray-500 text-right">YoY Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productData.map((product) => (
                        <tr key={product.name} className="border-t">
                          <td className="py-3 font-medium">{product.name}</td>
                          <td className="py-3 text-right">{product.forecast.toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end">
                              <span className={`mr-2 ${
                                product.accuracy >= 95 
                                  ? 'text-green-600' 
                                  : product.accuracy >= 90 
                                  ? 'text-blue-600' 
                                  : 'text-amber-600'
                              }`}>
                                {product.accuracy}%
                              </span>
                              <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    product.accuracy >= 95 
                                      ? 'bg-green-500' 
                                      : product.accuracy >= 90 
                                      ? 'bg-blue-500' 
                                      : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${product.accuracy}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <span className={
                              product.trend.startsWith('+') 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }>
                              {product.trend}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-sm text-gray-500">
                  Forecast Last Updated: <span className="font-medium">Today, 10:24 AM</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1.5" />
                    View Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1.5" />
                    Export Data
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  Regional Demand Distribution
                </CardTitle>
                <CardDescription>
                  Projected demand by geographical region
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-[calc(100%-7rem)]">
                <div className="h-[180px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      {/* PieChart components would go here */}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3 flex-grow">
                  {regionData.map((region) => (
                    <div key={region.name}>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{region.name}</span>
                        <span className="font-medium">{region.percentage}</span>
                      </div>
                      <Progress value={region.value} className="h-2" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium mb-2">AI Market Insights</div>
                  <p className="text-xs text-gray-600">
                    Our predictive models indicate increased demand in North America driven by infrastructure spending, while European markets show stabilization after recent volatility.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default DemandPlanning;
