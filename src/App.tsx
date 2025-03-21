import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect, useState, useContext } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DemandPlanning from "./pages/DemandPlanning";
import SupplyPlanning from "./pages/SupplyPlanning";
import OrderPromising from "./pages/OrderPromising";
import FactoryPlanning from "./pages/FactoryPlanning";
import InventoryOptimization from "./pages/InventoryOptimization";
import InventoryLiquidation from "./pages/InventoryLiquidation";
import LogisticsManagement from "./pages/LogisticsManagement";
import RiskManagement from "./pages/RiskManagement";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AiChatInterface from "./components/AiChatInterface";
import AccessDeniedDialog from "./components/AccessDeniedDialog";

import axios from 'axios';

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    if (
      (!response || response.status >= 500) && 
      config && 
      !config._retry &&
      config.method !== 'post'
    ) {
      config._retry = true;
      
      const retryDelay = Math.min(1000 * (2 ** (config._retryCount || 0)), 10000);
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      config._retryCount = (config._retryCount || 0) + 1;
      
      if (config._retryCount <= 3) {
        return axios(config);
      }
    }
    
    return Promise.reject(error);
  }
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 2,
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

const ModuleRoute = ({ element, moduleId }: { element: React.ReactNode, moduleId: string }) => {
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const { hasModuleAccess } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!hasModuleAccess(moduleId)) {
      setShowAccessDenied(true);
    }
  }, [hasModuleAccess, moduleId]);
  
  const handleAccessDeniedClose = () => {
    setShowAccessDenied(false);
    navigate('/');
  };
  
  if (showAccessDenied) {
    return (
      <AccessDeniedDialog 
        isOpen={showAccessDenied}
        onClose={handleAccessDeniedClose}
        resourceType="module"
        resourceName={moduleId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      />
    );
  }
  
  return <>{element}</>;
};

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const userIsAdmin = isAdmin();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!userIsAdmin) {
      navigate('/');
    }
  }, [userIsAdmin, navigate]);
  
  return userIsAdmin ? <>{children}</> : null;
};

const RequireModuleAccess = ({ children, moduleId }: { children: React.ReactNode, moduleId: string }) => {
  const hasAccess = hasModuleAccess(moduleId);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!hasAccess) {
      navigate('/');
    }
  }, [hasAccess, navigate]);
  
  return hasAccess ? <>{children}</> : null;
};

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<RequireAdmin><Signup /></RequireAdmin>} />
      <Route path="/auth/callback" element={<SSOCallback />} />

      <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
      
      <Route path="/demand-planning" element={
        <RequireAuth>
          <RequireModuleAccess moduleId="demand-planning">
            <DemandPlanning />
          </RequireModuleAccess>
        </RequireAuth>
      } />
      <Route path="/supply-planning" element={
        <RequireAuth>
          <RequireModuleAccess moduleId="supply-planning">
            <SupplyPlanning />
          </RequireModuleAccess>
        </RequireAuth>
      } />
      
      <Route path="/order-promising" element={
        <RequireAuth>
          <RequireModuleAccess moduleId="order-promising">
            <OrderPromising />
          </RequireModuleAccess>
        </RequireAuth>
      } />
      <Route path="/factory-planning" element={
        <RequireAuth>
          <RequireModuleAccess moduleId="factory-planning">
            <FactoryPlanning />
          </RequireModuleAccess>
        </RequireAuth>
      } />
      <Route path="/inventory-optimization" element={
        <RequireAuth>
          <RequireModuleAccess moduleId="inventory-optimization">
            <InventoryOptimization />
          </RequireModuleAccess>
        </RequireAuth>
      } />
      <Route path="/inventory-liquidation" element={
        <RequireAuth>
          <RequireModuleAccess moduleId="inventory-liquidation">
            <InventoryLiquidation />
          </RequireModuleAccess>
        </RequireAuth>
      } />
      <Route path="/logistics" element={
        <RequireAuth>
          <RequireModuleAccess moduleId="logistics">
            <LogisticsManagement />
          </RequireModuleAccess>
        </RequireAuth>
      } />
      <Route path="/risk-management" element={
        <RequireAuth>
          <RequireModuleAccess moduleId="risk-management">
            <RiskManagement />
          </RequireModuleAccess>
        </RequireAuth>
      } />
      <Route path="/analytics" element={
        <RequireAuth>
          <RequireModuleAccess moduleId="analytics">
            <Analytics />
          </RequireModuleAccess>
        </RequireAuth>
      } />
      
      <Route path="/kpi/:id" element={<RequireAuth><KpiDetails /></RequireAuth>} />
      
      <Route path="/notifications" element={<RequireAuth><NotificationsCenter /></RequireAuth>} />
      
      <Route path="/charts/production" element={<RequireAuth><ProductionChartDetails /></RequireAuth>} />
      <Route path="/charts/energy" element={<RequireAuth><EnergyChartDetails /></RequireAuth>} />
      
      <Route path="/user/preferences" element={<RequireAuth><UserPreferences /></RequireAuth>} />
      
      <Route path="/chat" element={<RequireAuth><GlobalChatPage /></RequireAuth>} />
      <Route path="/chat/:module" element={<RequireAuth><ModuleChatPage /></RequireAuth>} />
      
      <Route path="/news" element={<RequireAuth><NewsPage /></RequireAuth>} />
      
      <Route path="/agents" element={<RequireAuth><AgentsPage /></RequireAuth>} />
      <Route path="/agent/:agentId" element={<RequireAuth><AgentChatPage /></RequireAuth>} />
      <Route path="/create-agent" element={
        <RequireAuth>
          <RequireAdmin>
            <CreateAgentPage />
          </RequireAdmin>
        </RequireAuth>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <UserInactivityHandler />
            <AppRoutes />
            <AiChatInterface floating />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

