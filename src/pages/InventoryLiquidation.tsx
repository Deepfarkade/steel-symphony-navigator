
import React, { useEffect } from 'react';
import { Package2, TrendingDown } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';
import { generateAIResponse } from '../services/aiService';

const InventoryLiquidation = () => {
  const { insights, isLoading } = useModuleInsights('inventory-liquidation');
  
  // Enhanced page scroll control to ensure it starts at the top
  useEffect(() => {
    // Use setTimeout to ensure this runs after component mounting
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Use instant instead of smooth for more reliable behavior
      });
    }, 0);
  }, []);
  
  // Function to handle AI-generated liquidation strategies
  const handleGenerateLiquidationStrategies = async () => {
    try {
      const prompt = "Generate optimal liquidation strategies for excess steel inventory";
      const response = await generateAIResponse(prompt, "inventory-liquidation");
      console.log("AI-generated strategies:", response);
      return response;
    } catch (error) {
      console.error("Error generating liquidation strategies:", error);
      throw error;
    }
  };

  return (
    <ModuleLayout
      title="Inventory Liquidation"
      description="Optimize disposal of excess inventory with AI-driven recommendations"
      icon={<Package2 className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Inventory Liquidation" isLoading={isLoading}>
        {/* Inventory Liquidation content will go here */}
      </ModuleContent>
    </ModuleLayout>
  );
};

export default InventoryLiquidation;
