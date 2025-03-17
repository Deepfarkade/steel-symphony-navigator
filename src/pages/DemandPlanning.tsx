
import React from 'react';
import { BarChart3 } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const DemandPlanning = () => {
  const { insights, isLoading } = useModuleInsights('demand-planning');
  
  return (
    <ModuleLayout
      title="Demand Planning"
      description="AI-powered steel demand forecasting with multiple prediction models"
      icon={<BarChart3 className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Demand Planning" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default DemandPlanning;
