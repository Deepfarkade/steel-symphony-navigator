
import React, { useEffect } from 'react';
import { Orbit } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SupplyPlanning = () => {
  const { insights, isLoading } = useModuleInsights('supply-planning');
  const { hasModuleAccess } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check module access and handle navigation
  useEffect(() => {
    if (!hasModuleAccess('supply-planning')) {
      toast({
        title: "Access Denied",
        description: "You don't have access to the enterprise supply planning module.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [hasModuleAccess, navigate, toast]);
  
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
  
  // If user doesn't have access, don't render anything
  if (!hasModuleAccess('supply-planning')) {
    return null;
  }
  
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
