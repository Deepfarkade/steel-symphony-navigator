
import React from 'react';
import { Database } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const Analytics = () => {
  const { insights, isLoading } = useModuleInsights('analytics');
  
  return (
    <ModuleLayout
      title="Analytics & Reporting"
      description="Customizable dashboards and AI-generated narrative insights"
      icon={<Database className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Analytics & Reporting" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default Analytics;
