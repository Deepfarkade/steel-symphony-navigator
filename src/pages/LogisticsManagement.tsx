
import React, { useEffect } from 'react';
import { Truck } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const LogisticsManagement = () => {
  const { insights, isLoading } = useModuleInsights('logistics');
  
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
