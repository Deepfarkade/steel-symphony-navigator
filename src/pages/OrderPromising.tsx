
import React, { useState } from 'react';
import { ClipboardList, Calendar, Clock, Check, X, Star, Search, Filter, ChevronDown, ArrowRight, BarChart2, ListFilter, ShieldCheck } from 'lucide-react';
import ModuleLayout from '@/components/ModuleLayout';
import { useModuleInsights } from '@/hooks/useModuleInsights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const orderData = [
  { 
    id: "ORD-7829", 
    customer: "Acme Steel Works", 
    product: "Hot-Rolled Coil", 
    quantity: 250, 
    unit: "tons",
    requestedDate: "2023-12-15",
    promisedDate: "2023-12-18",
    status: "confirmed",
    reliability: 96,
    priority: "high"
  },
  { 
    id: "ORD-7830", 
    customer: "BuildRight Construction", 
    product: "Steel Beams", 
    quantity: 120, 
    unit: "tons",
    requestedDate: "2023-12-18",
    promisedDate: "2023-12-20",
    status: "confirmed",
    reliability: 94,
    priority: "medium"
  },
  { 
    id: "ORD-7831", 
    customer: "Global Auto Components", 
    product: "Cold-Rolled Sheet", 
    quantity: 180, 
    unit: "tons",
    requestedDate: "2023-12-12",
    promisedDate: "2023-12-17",
    status: "at risk",
    reliability: 82,
    priority: "high"
  },
  { 
    id: "ORD-7832", 
    customer: "MetalCraft Industries", 
    product: "Galvanized Steel", 
    quantity: 90, 
    unit: "tons",
    requestedDate: "2023-12-20",
    promisedDate: "2023-12-22",
    status: "confirmed",
    reliability: 98,
    priority: "low"
  },
  { 
    id: "ORD-7833", 
    customer: "Premier Fabricators", 
    product: "Steel Plates", 
    quantity: 75, 
    unit: "tons",
    requestedDate: "2023-12-14",
    promisedDate: "2023-12-21",
    status: "at risk",
    reliability: 79,
    priority: "medium"
  },
  { 
    id: "ORD-7834", 
    customer: "Alliance Manufacturing", 
    product: "Structural Steel", 
    quantity: 210, 
    unit: "tons",
    requestedDate: "2023-12-25",
    promisedDate: "2023-12-27",
    status: "confirmed",
    reliability: 92,
    priority: "high"
  },
  { 
    id: "ORD-7835", 
    customer: "Steel Solutions", 
    product: "Stainless Steel Coil", 
    quantity: 60, 
    unit: "tons",
    requestedDate: "2023-12-19",
    promisedDate: "2023-12-23",
    status: "confirmed",
    reliability: 95,
    priority: "medium"
  }
];

const otifData = [
  { month: 'Jan', otif: 92, target: 95 },
  { month: 'Feb', otif: 94, target: 95 },
  { month: 'Mar', otif: 91, target: 95 },
  { month: 'Apr', otif: 93, target: 95 },
  { month: 'May', otif: 96, target: 95 },
  { month: 'Jun', otif: 95, target: 95 },
  { month: 'Jul', otif: 97, target: 95 },
  { month: 'Aug', otif: 98, target: 95 },
  { month: 'Sep', otif: 96, target: 95 },
  { month: 'Oct', otif: 94, target: 95 },
  { month: 'Nov', otif: 95, target: 95 },
  { month: 'Dec', otif: 97, target: 95 },
];

const OrderPromising = () => {
  const { insights, isLoading } = useModuleInsights('order-promising');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptimizeDialog, setShowOptimizeDialog] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const filteredOrders = orderData.filter(order => {
    // Apply status filter
    if (filter !== 'all' && order.status !== filter) return false;
    
    // Apply search filter
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !order.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.product.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleRunOptimization = () => {
    setIsOptimizing(true);
    
    setTimeout(() => {
      setIsOptimizing(false);
      toast({
        title: "Promise Dates Optimized",
        description: "AI has recalculated promise dates based on current inventory and production capacity.",
      });
      setShowOptimizeDialog(false);
    }, 2500);
  };
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
  };
  
  return (
    <ModuleLayout
      title="Order Promising"
      description="Accurate order promise dates powered by AI for optimal customer delivery"
      icon={<ClipboardList className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Order Promise Dashboard
                </CardTitle>
                <CardDescription>
                  Real-time visibility of order promise dates and reliability metrics
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setShowOptimizeDialog(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Optimize Promise Dates
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-5 mb-6">
              <Card className="flex-1 bg-blue-50 border-blue-100">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Current OTIF</p>
                    <p className="text-2xl font-bold text-blue-700">96.3%</p>
                    <p className="text-xs text-blue-600">+1.8% vs. last month</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex-1 bg-green-50 border-green-100">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Promise Reliability</p>
                    <p className="text-2xl font-bold text-green-700">94.8%</p>
                    <p className="text-xs text-green-600">+0.9% vs. target</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="flex-1 bg-amber-50 border-amber-100">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Orders At Risk</p>
                    <p className="text-2xl font-bold text-amber-700">7</p>
                    <p className="text-xs text-amber-600">5.2% of active orders</p>
                  </div>
                  <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <X className="h-6 w-6 text-amber-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="h-64 mb-6">
              <p className="text-sm font-medium mb-3">OTIF Performance Trend</p>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={otifData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <defs>
                    <linearGradient id="colorOtif" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="otif" 
                    stroke="#4f46e5" 
                    fillOpacity={1} 
                    fill="url(#colorOtif)" 
                    name="OTIF %"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ef4444" 
                    strokeDasharray="3 3"
                    fill="none"
                    name="Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-indigo-500" />
                  Order Promise Queue
                </CardTitle>
                <CardDescription>
                  AI-generated promise dates for customer orders
                </CardDescription>
              </div>
              <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search orders..."
                    className="w-full md:w-[250px] pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select defaultValue={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="at risk">At Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-medium text-gray-500">Order ID</th>
                    <th className="pb-3 font-medium text-gray-500">Customer</th>
                    <th className="pb-3 font-medium text-gray-500">Product</th>
                    <th className="pb-3 font-medium text-gray-500 text-right">Quantity</th>
                    <th className="pb-3 font-medium text-gray-500">Promise Date</th>
                    <th className="pb-3 font-medium text-gray-500">Status</th>
                    <th className="pb-3 font-medium text-gray-500 text-right">Reliability</th>
                    <th className="pb-3 font-medium text-gray-500 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.product}</td>
                      <td className="py-3 text-right">{order.quantity} {order.unit}</td>
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span>{new Date(order.promisedDate).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-500">
                            Req: {new Date(order.requestedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge className={
                          order.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                        }>
                          {order.status === 'confirmed' ? 'Confirmed' : 'At Risk'}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className={`font-medium ${
                          order.reliability >= 90 
                            ? 'text-green-600' 
                            : order.reliability >= 80 
                            ? 'text-amber-600' 
                            : 'text-red-600'
                        }`}>
                          {order.reliability}%
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t py-3 flex justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {orderData.length} orders
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">New Order</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Optimize Dialog */}
      <Dialog open={showOptimizeDialog} onOpenChange={setShowOptimizeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Promise Date Optimization</DialogTitle>
            <DialogDescription>
              Our AI will recalculate optimal promise dates based on current inventory, production capacity, and logistics constraints.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium mb-2 flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2 text-blue-600" />
                  AI Optimization Parameters
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority for high-value orders</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consider current inventory</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Use alternate production routes</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expedite at-risk orders</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h3 className="font-medium mb-2 text-amber-800">Impact Analysis</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Our AI predicts the following impacts if optimization is applied:
                </p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" /> Improve overall OTIF by 1.2%
                  </li>
                  <li className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" /> Reduce at-risk orders from 7 to 3
                  </li>
                  <li className="flex items-center text-amber-600">
                    <Clock className="h-4 w-4 mr-1" /> Average promise date change: +1.3 days
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOptimizeDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleRunOptimization}
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Optimizing...
                </>
              ) : (
                "Run AI Optimization"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              Order Details: {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Comprehensive view of order details and delivery status
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Customer:</span>
                      <span className="text-sm font-medium">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Product:</span>
                      <span className="text-sm font-medium">{selectedOrder.product}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <span className="text-sm font-medium">{selectedOrder.quantity} {selectedOrder.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Priority:</span>
                      <Badge className={
                        selectedOrder.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : selectedOrder.priority === 'medium'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }>
                        {selectedOrder.priority.charAt(0).toUpperCase() + selectedOrder.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Requested Date:</span>
                      <span className="text-sm font-medium">{new Date(selectedOrder.requestedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Promised Date:</span>
                      <span className="text-sm font-medium">{new Date(selectedOrder.promisedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={
                        selectedOrder.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }>
                        {selectedOrder.status === 'confirmed' ? 'Confirmed' : 'At Risk'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reliability:</span>
                      <span className={`text-sm font-medium ${
                        selectedOrder.reliability >= 90 
                          ? 'text-green-600' 
                          : selectedOrder.reliability >= 80 
                          ? 'text-amber-600' 
                          : 'text-red-600'
                      }`}>
                        {selectedOrder.reliability}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedOrder.status === 'at risk' && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6">
                  <h3 className="font-medium text-amber-800 mb-2">Risk Factors</h3>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start">
                      <X className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                      <span>Material shortage: Delayed shipment of raw materials from supplier</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
                      <span>Production capacity: High volume of priority orders competing for same production slot</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <h4 className="font-medium text-sm mb-2">AI Recommendations</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-2">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">Use alternate material source from Pittsburgh warehouse</span>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-2">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">Split order into two batches to accelerate partial delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="rounded-lg border">
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <h3 className="font-medium">Order Timeline</h3>
                </div>
                <div className="p-4">
                  <div className="relative border-l border-gray-200 pl-6 ml-3 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-10 mt-1 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Order Received</p>
                        <p className="text-xs text-gray-500">Nov 28, 2023 - 10:24 AM</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 mt-1 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">AI Promise Date Generated</p>
                        <p className="text-xs text-gray-500">Nov 28, 2023 - 10:26 AM</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-10 mt-1 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Production Scheduled</p>
                        <p className="text-xs text-gray-500">Dec 10, 2023 - 08:00 AM</p>
                      </div>
                    </div>
                    
                    {selectedOrder.status === 'at risk' ? (
                      <div className="relative">
                        <div className="absolute -left-10 mt-1 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-600"></div>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-amber-700">At Risk Status Detected</p>
                          <p className="text-xs text-gray-500">Dec 12, 2023 - 03:18 PM</p>
                          <p className="text-xs text-amber-600 mt-1">Material shortage detected by AI monitoring system</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute -left-10 mt-1 h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-gray-400"></div>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-400">Ready for Production</p>
                          <p className="text-xs text-gray-400">Scheduled</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline">
              View Full Details
            </Button>
            <Button>Update Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  );
};

export default OrderPromising;
