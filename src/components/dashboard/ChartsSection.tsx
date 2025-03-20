
import React from 'react';
import { motion } from 'framer-motion';
import AiInsights from '@/components/AiInsights';
import ProductionChart from './ProductionChart';
import EnergyConsumptionChart from './EnergyConsumptionChart';

interface ChartsSectionProps {
  productionData: any[];
  energyData: any[];
  insights: any[];
  loading: boolean;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ 
  productionData, 
  energyData, 
  insights, 
  loading 
}) => {
  return (
    <>
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="col-span-2">
          <ProductionChart data={productionData} />
        </div>
        <div className="col-span-1">
          <AiInsights insights={insights} loading={loading} />
        </div>
      </motion.div>
      
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <EnergyConsumptionChart data={energyData} />
      </motion.div>
    </>
  );
};

export default ChartsSection;
