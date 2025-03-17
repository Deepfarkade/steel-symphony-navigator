
import React from 'react';
import { Box } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const InventoryLiquidation = () => {
  const { insights, isLoading } = useModuleInsights('inventory-liquidation');
  
  return (
    <ModuleLayout
      title="Inventory Liquidation"
      description="AI-powered pricing recommendations for liquidation of excess inventory"
      icon={<Box className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Inventory Liquidation" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default InventoryLiquidation;
