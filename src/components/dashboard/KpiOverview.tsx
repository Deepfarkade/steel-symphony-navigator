
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Zap, LineChart, Timer, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import KpiCard from '@/components/KpiCard';

interface KpiData {
  productionYield?: { value: string; change: number };
  energyConsumption?: { value: string; change: number };
  qualityRating?: { value: string; change: number };
  onTimeDelivery?: { value: string; change: number };
}

interface KpiOverviewProps {
  kpiData: KpiData;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const KpiOverview: React.FC<KpiOverviewProps> = ({ kpiData }) => {
  return (
    <motion.div
      className="mb-8"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-ey-darkGray">Today's Overview</h2>
        <div className="ml-2 px-2 py-1 bg-purple-100 rounded-md text-xs font-medium text-purple-700 flex items-center">
          <Brain className="h-3 w-3 mr-1" />
          AI Powered
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div custom={0} variants={fadeIn}>
          <Link to="/kpi/production-yield">
            <KpiCard 
              title="Production Yield" 
              value={kpiData.productionYield?.value || "94.8%"} 
              change={Number(kpiData.productionYield?.change || 2.3)} 
              icon={<BarChart2 className="h-6 w-6 text-ey-darkGray" />} 
            />
          </Link>
        </motion.div>
        <motion.div custom={1} variants={fadeIn}>
          <Link to="/kpi/energy-consumption">
            <KpiCard 
              title="Energy Consumption" 
              value={kpiData.energyConsumption?.value || "1,235 MWh"} 
              change={Number(kpiData.energyConsumption?.change || -5.7)} 
              icon={<Zap className="h-6 w-6 text-ey-darkGray" />}
              color="bg-blue-100" 
            />
          </Link>
        </motion.div>
        <motion.div custom={2} variants={fadeIn}>
          <Link to="/kpi/quality-rating">
            <KpiCard 
              title="Quality Rating" 
              value={kpiData.qualityRating?.value || "A+"} 
              change={Number(kpiData.qualityRating?.change || 1.2)} 
              icon={<LineChart className="h-6 w-6 text-ey-darkGray" />}
              color="bg-green-100" 
            />
          </Link>
        </motion.div>
        <motion.div custom={3} variants={fadeIn}>
          <Link to="/kpi/on-time-delivery">
            <KpiCard 
              title="On-Time Delivery" 
              value={kpiData.onTimeDelivery?.value || "92.3%"} 
              change={Number(kpiData.onTimeDelivery?.change || -0.8)} 
              icon={<Timer className="h-6 w-6 text-ey-darkGray" />}
              color="bg-purple-100" 
            />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default KpiOverview;
