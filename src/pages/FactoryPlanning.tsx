
import React, { useState, useEffect } from 'react';
import { Factory, Clock, Zap, BarChart2, Check, Calendar, ChevronRight, ArrowRight } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { getModuleInsights } from '@/services/dataService';
import { motion } from 'framer-motion';
import websocketService from '@/services/websocketService';

const FactoryPlanning = () => {
  const [optimizationRecommendations, setOptimizationRecommendations] = useState<any[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    if (!websocketService.isConnected()) {
      websocketService.connect();
    }

    // Simulate fetching optimization recommendations
    const fetchRecommendations = async () => {
      try {
        // In a real app, this would fetch from your API
        const mockData = [
          {
            id: 1,
            machine: 'Blast Furnace #3',
            currentEfficiency: '82%',
            optimizedEfficiency: '89%',
            potentialSavings: '$5,280/month',
            implementationTime: 'Low',
            status: 'Recommended'
          },
          {
            id: 2,
            machine: 'Rolling Mill #2',
            currentEfficiency: '76%',
            optimizedEfficiency: '85%',
            potentialSavings: '$9,120/month',
            implementationTime: 'Medium',
            status: 'In Progress'
          },
          {
            id: 3,
            machine: 'Cooling Tower',
            currentEfficiency: '91%',
            optimizedEfficiency: '94%',
            potentialSavings: '$2,340/month',
            implementationTime: 'Low',
            status: 'Implemented'
          },
          {
            id: 4,
            machine: 'Continuous Casting',
            currentEfficiency: '79%',
            optimizedEfficiency: '88%',
            potentialSavings: '$7,650/month',
            implementationTime: 'High',
            status: 'Under Review'
          }
        ];
        
        setOptimizationRecommendations(mockData);
      } catch (error) {
        console.error('Error fetching optimization recommendations:', error);
      }
    };
    
    fetchRecommendations();
  }, []);
  
  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    
    // Simulate AI generating a plan
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setShowSuccessDialog(true);
      
      toast({
        title: "Production Plan Generated",
        description: "The AI has successfully created an optimized production plan for the next cycle.",
      });
      
      // Send websocket message to update chat
      websocketService.sendMessage('chat', {
        text: "I've just generated a new optimized production plan for your factory. Would you like me to explain the key optimization areas?",
        moduleContext: "Factory Planning",
        timestamp: new Date().toISOString(),
        isUser: false
      });
    }, 3000);
  };

  return (
    <ModuleLayout
      title="Factory Planning"
      description="AI-powered steel production scheduling optimization and resource allocation"
      icon={<Factory className="h-6 w-6 text-ey-darkGray" />}
      moduleName="factory-planning"
    >
      <div className="space-y-6">
        {/* Factory Overview */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Factory Performance Overview</CardTitle>
            <CardDescription>Current production efficiency and utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-ey-yellow mr-2" />
                  <span className="text-sm font-medium text-ey-darkGray">Uptime</span>
                </div>
                <div className="text-2xl font-bold">94.3%</div>
                <div className="flex items-center text-xs text-green-600 font-medium mt-1">
                  <span className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-1 transform rotate-45" />
                    2.1% higher than target
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Zap className="h-5 w-5 text-ey-yellow mr-2" />
                  <span className="text-sm font-medium text-ey-darkGray">Energy Efficiency</span>
                </div>
                <div className="text-2xl font-bold">82.7%</div>
                <div className="flex items-center text-xs text-yellow-600 font-medium mt-1">
                  <span className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-1 transform -rotate-45" />
                    1.3% below target
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <BarChart2 className="h-5 w-5 text-ey-yellow mr-2" />
                  <span className="text-sm font-medium text-ey-darkGray">Production Rate</span>
                </div>
                <div className="text-2xl font-bold">423 tons/day</div>
                <div className="flex items-center text-xs text-green-600 font-medium mt-1">
                  <span className="flex items-center">
                    <ArrowRight className="h-3 w-3 mr-1 transform rotate-45" />
                    On target
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-ey-lightGray">
                Last updated: Today at 14:32
              </div>
              <Button variant="outline" size="sm" className="text-ey-darkGray hover:text-ey-darkGray/80">
                <span>View Details</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* AI-Generated Optimization Recommendations */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">AI-Generated Optimization Recommendations</CardTitle>
                <CardDescription>Machine learning-driven efficiency improvements</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export Recommendations</DropdownMenuItem>
                  <DropdownMenuItem>Schedule Implementation</DropdownMenuItem>
                  <DropdownMenuItem>Refresh Analysis</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine/Process</TableHead>
                    <TableHead>Current Efficiency</TableHead>
                    <TableHead>Optimized Efficiency</TableHead>
                    <TableHead>Potential Savings</TableHead>
                    <TableHead>Implementation</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optimizationRecommendations.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-medium">{rec.machine}</TableCell>
                      <TableCell>{rec.currentEfficiency}</TableCell>
                      <TableCell className="text-green-600 font-medium">{rec.optimizedEfficiency}</TableCell>
                      <TableCell>{rec.potentialSavings}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          rec.implementationTime === 'Low' ? 'bg-green-100 text-green-800' :
                          rec.implementationTime === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rec.implementationTime}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`flex items-center text-xs ${
                          rec.status === 'Implemented' ? 'text-green-600' :
                          rec.status === 'In Progress' ? 'text-blue-600' :
                          rec.status === 'Recommended' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {rec.status === 'Implemented' && <Check className="h-3 w-3 mr-1" />}
                          {rec.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Production Planning */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">AI-Powered Production Planning</CardTitle>
            <CardDescription>Generate optimized production schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ey-darkGray mb-1">Production Period</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type="date" className="pl-10" defaultValue="2023-07-01" />
                    </div>
                    <span className="flex items-center">to</span>
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input type="date" className="pl-10" defaultValue="2023-07-31" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ey-darkGray mb-1">Production Target (tons)</label>
                  <Input type="number" defaultValue="12500" min="0" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ey-darkGray mb-1">Steel Grade Priority</label>
                  <select className="w-full border rounded-md p-2 border-input">
                    <option>High Carbon (Priority)</option>
                    <option>Medium Carbon</option>
                    <option>Low Carbon</option>
                    <option>Stainless 304</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ey-darkGray mb-1">Optimization Goal</label>
                  <select className="w-full border rounded-md p-2 border-input">
                    <option>Energy Efficiency</option>
                    <option>Maximum Output</option>
                    <option>Minimum Changeover</option>
                    <option>Cost Reduction</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ey-darkGray mb-1">Resource Constraints</label>
                  <select className="w-full border rounded-md p-2 border-input">
                    <option>Consider All Resources</option>
                    <option>Labor Constraints Only</option>
                    <option>Equipment Constraints Only</option>
                    <option>No Constraints</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleGeneratePlan} 
              disabled={isGeneratingPlan}
              className="w-full bg-ey-yellow hover:bg-ey-yellow/90 text-ey-darkGray"
            >
              {isGeneratingPlan ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-ey-darkGray"></div>
                  Generating Optimized Plan...
                </>
              ) : (
                <>Generate AI-Optimized Production Plan</>
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Production Plan Generated
              </DialogTitle>
              <DialogDescription>
                The AI has successfully created an optimized production plan
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 mb-4">
              <p className="text-green-800 text-sm">
                Your production plan has been optimized with the following improvements:
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5" />
                  <span>5.3% reduction in energy consumption</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5" />
                  <span>12% reduction in changeover time</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5" />
                  <span>3.8% increase in daily output capacity</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5" />
                  <span>Estimated $42,300 in monthly cost savings</span>
                </li>
              </ul>
            </div>
            
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline">View Detailed Plan</Button>
              <Button onClick={() => setShowSuccessDialog(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ModuleLayout>
  );
};

export default FactoryPlanning;
