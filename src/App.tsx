
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demand-planning" element={<DemandPlanning />} />
          <Route path="/supply-planning" element={<SupplyPlanning />} />
          <Route path="/order-promising" element={<OrderPromising />} />
          <Route path="/factory-planning" element={<FactoryPlanning />} />
          <Route path="/inventory-optimization" element={<InventoryOptimization />} />
          <Route path="/inventory-liquidation" element={<InventoryLiquidation />} />
          <Route path="/logistics" element={<LogisticsManagement />} />
          <Route path="/risk-management" element={<RiskManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
