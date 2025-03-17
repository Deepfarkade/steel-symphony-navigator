
import React from 'react';
import { ClipboardList } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';

const OrderPromising = () => {
  const { insights, isLoading } = useModuleInsights('order-promising');
  
  return (
    <ModuleLayout
      title="Order Promising"
      description="Dynamic ATP calculations for steel products and delivery prediction"
      icon={<ClipboardList className="h-6 w-6 text-ey-darkGray" />}
      insights={insights}
    >
      <ModuleContent moduleType="Order Promising" isLoading={isLoading} />
    </ModuleLayout>
  );
};

export default OrderPromising;
