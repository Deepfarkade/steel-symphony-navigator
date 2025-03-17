
import React from 'react';
import { Box, Sparkles } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const InventoryLiquidation = () => {
  const { insights, isLoading } = useModuleInsights('inventory-liquidation');
  
  return (
    <ModuleLayout
      title="Inventory Liquidation"
      description="AI-powered pricing recommendations and buyer matching for liquidation of excess inventory"
      icon={<Box className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <div className="bg-ey-yellow/5 border border-ey-yellow/20 rounded-lg p-4 mb-6 flex items-start">
        <Sparkles className="h-5 w-5 text-ey-yellow mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-ey-darkGray mb-1">AI Co-Pilot Feature</h3>
          <p className="text-sm text-ey-lightGray">
            This module uses EY's generative AI to analyze your excess inventory, predict optimal pricing for rapid liquidation, and identify potential buyers through pattern recognition in market data.
          </p>
        </div>
      </div>
      
      <ModuleContent moduleType="Inventory Liquidation" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default InventoryLiquidation;
