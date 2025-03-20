
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AreaChart from '@/components/AreaChart';
import { motion } from 'framer-motion';

interface EnergyConsumptionChartProps {
  data: any[];
}

const EnergyConsumptionChart: React.FC<EnergyConsumptionChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          Energy Consumption (MWh)
          <motion.div
            className="ml-2 h-2 w-2 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </CardTitle>
        <CardDescription>
          Monitoring energy efficiency
          <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-500 border-blue-200">
            AI Optimized
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AreaChart 
          data={data} 
          color="#9b87f5"
          title="Energy Usage"
        />
      </CardContent>
      <CardFooter className="pt-0">
        <Link to="/charts/energy">
          <Button variant="ghost" className="text-purple-600 flex items-center">
            <span>View efficiency recommendations</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EnergyConsumptionChart;
