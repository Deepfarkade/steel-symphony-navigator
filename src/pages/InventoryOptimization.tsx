
import React from 'react';
import { Package } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const InventoryOptimization = () => {
  const { insights, isLoading } = useModuleInsights('inventory-optimization');
  
  return (
    <ModuleLayout
      title="Inventory Optimization"
      description="Multi-echelon inventory optimization for raw materials and finished steel products"
      icon={<Package className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Inventory Optimization" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default InventoryOptimization;
