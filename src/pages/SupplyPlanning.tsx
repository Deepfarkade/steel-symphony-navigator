
import React, { useEffect, useState } from 'react';
import { Orbit } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import ModuleContent from '../components/ModuleContent';
import { useModuleInsights } from '../hooks/useModuleInsights';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AccessDeniedDialog from '@/components/AccessDeniedDialog';

const SupplyPlanning = () => {
  const { insights, isLoading } = useModuleInsights('supply-planning');
  const { hasModuleAccess } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  
  // Check module access and handle navigation
  useEffect(() => {
    if (!hasModuleAccess('supply-planning')) {
      setShowAccessDenied(true);
    }
  }, [hasModuleAccess]);
  
  // Enhanced page scroll control to ensure it starts at the top
  useEffect(() => {
    // Use setTimeout to ensure this runs after component mounting
    const timeoutId = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant' // Use instant instead of smooth for more reliable behavior
      });
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  const handleAccessDeniedClose = () => {
    setShowAccessDenied(false);
    navigate('/');
  };
  
  // If user doesn't have access, show dialog
  if (!hasModuleAccess('supply-planning')) {
    return (
      <AccessDeniedDialog 
        isOpen={showAccessDenied}
        onClose={handleAccessDeniedClose}
        resourceType="module"
        resourceName="Enterprise Supply Planning"
      />
    );
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
