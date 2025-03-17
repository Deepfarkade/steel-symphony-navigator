
import React from 'react';
import { Truck } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const LogisticsManagement = () => {
  const { insights, isLoading } = useModuleInsights('logistics');
  
  return (
    <ModuleLayout
      title="Logistics Management"
      description="Route optimization for heavy steel transport and carrier selection"
      icon={<Truck className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Logistics Management" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default LogisticsManagement;
