
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  ArrowUpDown, 
  PackageCheck, 
  PackageX, 
  AlertCircle, 
  TrendingUp, 
  BarChart,
  FileText,
  RefreshCw,
  Truck,
  PieChart,
  ArrowRight,
  Zap,
  Brain,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import ModuleLayout from '@/components/ModuleLayout';
import AreaChart from '@/components/AreaChart';
import { useModuleInsights } from '../hooks/useModuleInsights';
import { toast } from '@/hooks/use-toast';

const inventoryData = [
  { name: 'Jan', value: 4000, target: 3800 },
  { name: 'Feb', value: 3800, target: 3600 },
  { name: 'Mar', value: 4200, target: 3500 },
  { name: 'Apr', value: 3900, target: 3400 },
  { name: 'May', value: 3600, target: 3300 },
  { name: 'Jun', value: 3400, target: 3200 },
  { name: 'Jul', value: 3200, target: 3000 }
];

const warehouseUtilization = [
  { name: 'Chicago', value: 82, max: 100 },
  { name: 'Pittsburgh', value: 67, max: 100 },
  { name: 'Detroit', value: 91, max: 100 },
  { name: 'Houston', value: 72, max: 100 },
  { name: 'Cleveland', value: 58, max: 100 }
];

const productCategories = [
  { name: 'Hot-Rolled Coil', value: 42, unit: 'tons', trend: '+5%' },
  { name: 'Cold-Rolled Coil', value: 38, unit: 'tons', trend: '-2%' },
  { name: 'Galvanized Sheet', value: 28, unit: 'tons', trend: '+8%' },
  { name: 'Steel Plates', value: 21, unit: 'tons', trend: '-3%' },
  { name: 'Steel Bars', value: 15, unit: 'tons', trend: 'stable' }
];

const InventoryOptimization = () => {
  const { insights, isLoading } = useModuleInsights('inventory-optimization');
  
  const handleOptimize = () => {
    toast({
      title: "AI Optimization in Progress",
      description: "Our algorithms are analyzing your inventory data to find optimal levels."
    });
  };
  
  return (
    <ModuleLayout
      title="Inventory Optimization"
      description="Multi-echelon inventory optimization for raw materials and finished steel products"
      icon={<PackageX className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <PackageX className="h-5 w-5 mr-2 text-blue-500" /> 
                Inventory Health Overview
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={handleOptimize}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Refresh Data
              </Button>
            </div>
            <CardDescription>Current stock levels and KPIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Working Capital</p>
                    <h3 className="text-2xl font-bold text-gray-800">$28.4M</h3>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                  <span>-12% from last quarter</span>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Inventory Turns</p>
                    <h3 className="text-2xl font-bold text-gray-800">8.7x</h3>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <RefreshCw className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                  <span>+1.2x vs. industry average</span>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Stock Accuracy</p>
                    <h3 className="text-2xl font-bold text-gray-800">97.3%</h3>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <BarChart className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                  <span>+2.1% from previous month</span>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="trends">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trends">Inventory Trends</TabsTrigger>
                <TabsTrigger value="warehouse">Warehouse Utilization</TabsTrigger>
                <TabsTrigger value="products">Product Categories</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trends" className="pt-4">
                <div className="h-64">
                  <AreaChart
                    data={inventoryData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    {/* Chart elements would go here */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                      Inventory Trend vs Target - Last 7 Months
                    </div>
                  </AreaChart>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="border rounded-md p-3 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">Stock on Hand</p>
                    <p className="font-semibold">16,425 tons</p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">Days of Supply</p>
                    <p className="font-semibold">42 days</p>
                  </div>
                  <div className="border rounded-md p-3 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-1">Slow-moving Items</p>
                    <p className="font-semibold">243 SKUs</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="warehouse" className="pt-4">
                <div className="space-y-4">
                  {warehouseUtilization.map((warehouse) => (
                    <div key={warehouse.name} className="flex flex-col">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{warehouse.name}</span>
                        <span className="text-sm text-gray-500">{warehouse.value}%</span>
                      </div>
                      <Progress value={warehouse.value} className="h-2" />
                      {warehouse.value > 85 && (
                        <p className="text-xs text-amber-600 mt-1">
                          Near capacity - consider rebalancing inventory
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Product Category</th>
                        <th className="text-right py-2 font-medium">Quantity</th>
                        <th className="text-right py-2 font-medium">Trend</th>
                        <th className="text-right py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productCategories.map((product) => (
                        <tr key={product.name} className="border-b hover:bg-gray-50">
                          <td className="py-2">{product.name}</td>
                          <td className="text-right">{product.value}K {product.unit}</td>
                          <td className="text-right">
                            <span className={
                              product.trend.includes('+') 
                                ? 'text-green-600' 
                                : product.trend.includes('-') 
                                ? 'text-red-600' 
                                : 'text-gray-600'
                            }>
                              {product.trend}
                            </span>
                          </td>
                          <td className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs 
                              ${product.value > 30 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : product.value < 20 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'}`
                            }>
                              {product.value > 30 
                                ? 'Excess' 
                                : product.value < 20 
                                ? 'Low' 
                                : 'Optimal'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-500" /> 
                AI-Powered Inventory Optimization
              </CardTitle>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                size="sm"
                onClick={handleOptimize}
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Optimize Now
              </Button>
            </div>
            <CardDescription>Machine learning recommendations to reduce costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-purple-800 mb-2 flex items-center">
                <Box className="h-4 w-4 mr-2" /> 
                AI Recommendation Summary
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Our AI algorithms have analyzed your inventory patterns and identified the following optimization opportunities:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                    <ChevronDown className="h-3 w-3 text-green-700" />
                  </div>
                  <span>Reduce safety stock for Cold-Rolled Coil by 15% in Chicago warehouse to free up $1.2M in working capital</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                    <ChevronDown className="h-3 w-3 text-green-700" />
                  </div>
                  <span>Identify 128 slow-moving SKUs for potential liquidation, estimated savings of $450K</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-2 mt-0.5">
                    <ChevronDown className="h-3 w-3 text-green-700" />
                  </div>
                  <span>Rebalance inventory across warehouses to reduce Detroit facility utilization from 91% to 78%</span>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Potential Cost Savings</h3>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">$2.4M</span>
                  <Button variant="outline" size="sm">Apply Changes</Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Estimated annual savings based on AI recommendations
                </p>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Savings Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Working Capital Reduction</span>
                      <span className="text-xs font-medium">$1.8M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Logistics Savings</span>
                      <span className="text-xs font-medium">$420K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Warehouse Optimization</span>
                      <span className="text-xs font-medium">$180K</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">AI Simulated Scenarios</h3>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded p-3 border border-blue-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Conservative</span>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low Risk</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Safe inventory reductions with minimal disruption</p>
                    <div className="flex justify-between text-xs">
                      <span>Savings: $1.2M</span>
                      <span>Service Level Impact: 0%</span>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded p-3 border border-amber-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Balanced</span>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium Risk</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Optimal balance between savings and service levels</p>
                    <div className="flex justify-between text-xs">
                      <span>Savings: $2.4M</span>
                      <span>Service Level Impact: -0.5%</span>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded p-3 border border-red-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Aggressive</span>
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Risk</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Maximum savings with accepted service impact</p>
                    <div className="flex justify-between text-xs">
                      <span>Savings: $3.8M</span>
                      <span>Service Level Impact: -2.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default InventoryOptimization;
