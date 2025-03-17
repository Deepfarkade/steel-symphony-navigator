
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const RiskManagement = () => {
  const { insights, isLoading } = useModuleInsights('risk-management');
  
  return (
    <ModuleLayout
      title="Risk Management"
      description="Steel supply chain risk identification and proactive mitigation recommendations"
      icon={<AlertTriangle className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Risk Management" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default RiskManagement;
