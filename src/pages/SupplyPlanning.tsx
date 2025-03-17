
import React from 'react';
import { Orbit } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const SupplyPlanning = () => {
  const { insights, isLoading } = useModuleInsights('supply-planning');
  
  return (
    <ModuleLayout
      title="Enterprise Supply Planning"
      description="End-to-end steel supply network visualization and optimization"
      icon={<Orbit className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Supply Planning" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default SupplyPlanning;
