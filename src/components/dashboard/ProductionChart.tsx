
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AreaChart from '@/components/AreaChart';

interface ProductionChartProps {
  data: any[];
}

const ProductionChart: React.FC<ProductionChartProps> = ({ data }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          Steel Production (tons)
          <motion.div
            className="ml-2 h-2 w-2 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </CardTitle>
        <CardDescription>
          Real-time production data
          <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-500 border-purple-200">
            AI Analysis
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AreaChart 
          data={data} 
          color="#7E69AB"
          title="Steel Production"
        />
      </CardContent>
      <CardFooter className="pt-0">
        <Link to="/charts/production">
          <Button variant="ghost" className="text-purple-600 flex items-center">
            <span>View detailed report</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>

        <Link to="/analytics" className="ml-auto">
          <Button variant="outline" size="sm" className="text-purple-500 border-purple-200 hover:bg-purple-50">
            Advanced Analytics
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductionChart;
