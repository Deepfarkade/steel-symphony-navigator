
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
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

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    {/* Protected routes */}
    <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
    <Route path="/demand-planning" element={<RequireAuth><DemandPlanning /></RequireAuth>} />
    <Route path="/supply-planning" element={<RequireAuth><SupplyPlanning /></RequireAuth>} />
    <Route path="/order-promising" element={<RequireAuth><OrderPromising /></RequireAuth>} />
    <Route path="/factory-planning" element={<RequireAuth><FactoryPlanning /></RequireAuth>} />
    <Route path="/inventory-optimization" element={<RequireAuth><InventoryOptimization /></RequireAuth>} />
    <Route path="/inventory-liquidation" element={<RequireAuth><InventoryLiquidation /></RequireAuth>} />
    <Route path="/logistics" element={<RequireAuth><LogisticsManagement /></RequireAuth>} />
    <Route path="/risk-management" element={<RequireAuth><RiskManagement /></RequireAuth>} />
    <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <AiChatInterface floating />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
