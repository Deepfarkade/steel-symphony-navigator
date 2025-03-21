
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";
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

// Import additional routes for specific features
import KpiDetails from "./pages/KpiDetails";
import NotificationsCenter from "./pages/NotificationsCenter";
import ModuleChatPage from "./pages/ModuleChatPage";
import GlobalChatPage from "./pages/GlobalChatPage";
import ProductionChartDetails from "./pages/charts/ProductionChartDetails";
import EnergyChartDetails from "./pages/charts/EnergyChartDetails";
import UserPreferences from "./pages/user/UserPreferences";
import UserInactivityHandler from "./components/UserInactivityHandler";
import NewsPage from "./pages/NewsPage";
import AgentChatPage from "./pages/AgentChatPage";
import AgentsPage from "./pages/AgentsPage";
import CreateAgentPage from "./pages/CreateAgentPage";
import SSOCallback from "./pages/auth/SSOCallback";
import { isAdmin, hasModuleAccess } from "./services/authService";

// Install axios dependency
import axios from 'axios';

// Create a custom retry function for axios to enhance scalability
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // Retry the request if it failed due to network errors or 5xx server errors
    if (
      (!response || response.status >= 500) && 
      config && 
      !config._retry &&
      config.method !== 'post' // Don't retry POST requests to prevent duplicate submissions
    ) {
      config._retry = true;
      
      // Add exponential backoff (wait time increases with each retry)
      const retryDelay = Math.min(1000 * (2 ** (config._retryCount || 0)), 10000);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      // Track retry count
      config._retryCount = (config._retryCount || 0) + 1;
      
      // Max 3 retries
      if (config._retryCount <= 3) {
        return axios(config);
      }
    }
    
    return Promise.reject(error);
  }
);

// Create query client with retry and batch support for scalability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Retry failed queries
      staleTime: 60 * 1000, // Consider data stale after 1 minute
      gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
    mutations: {
      retry: 2, // Retry failed mutations
    },
  },
});

// ScrollToTop component to handle scrolling on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use a short timeout to ensure the component has fully rendered
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }, 0);
  }, [pathname]);

  return null;
};

// Admin route guard component
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

// Module access guard component
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
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<RequireAdmin><Signup /></RequireAdmin>} />
      <Route path="/auth/callback" element={<SSOCallback />} />

      {/* Protected routes */}
      <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
      
      {/* Module routes with permission checks */}
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
      
      {/* KPI detail routes */}
      <Route path="/kpi/:id" element={<RequireAuth><KpiDetails /></RequireAuth>} />
      
      {/* Notification routes */}
      <Route path="/notifications" element={<RequireAuth><NotificationsCenter /></RequireAuth>} />
      
      {/* Chart detail routes */}
      <Route path="/charts/production" element={<RequireAuth><ProductionChartDetails /></RequireAuth>} />
      <Route path="/charts/energy" element={<RequireAuth><EnergyChartDetails /></RequireAuth>} />
      
      {/* User routes */}
      <Route path="/user/preferences" element={<RequireAuth><UserPreferences /></RequireAuth>} />
      
      {/* Chat routes */}
      <Route path="/chat" element={<RequireAuth><GlobalChatPage /></RequireAuth>} />
      <Route path="/chat/:module" element={<RequireAuth><ModuleChatPage /></RequireAuth>} />
      
      {/* News route */}
      <Route path="/news" element={<RequireAuth><NewsPage /></RequireAuth>} />
      
      {/* Agents routes */}
      <Route path="/agents" element={<RequireAuth><AgentsPage /></RequireAuth>} />
      <Route path="/agent/:agentId" element={<RequireAuth><AgentChatPage /></RequireAuth>} />
      <Route path="/create-agent" element={
        <RequireAuth>
          <RequireAdmin>
            <CreateAgentPage />
          </RequireAdmin>
        </RequireAuth>
      } />
      
      {/* Catch-all route */}
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
            <AiChatInterface fixedPosition={false} />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
