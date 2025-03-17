
import React from 'react';
import { Factory } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const FactoryPlanning = () => {
  const { insights, isLoading } = useModuleInsights('factory-planning');
  
  return (
    <ModuleLayout
      title="Factory Planning"
      description="Steel production scheduling optimization and resource allocation"
      icon={<Factory className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Factory Planning" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default FactoryPlanning;
