
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demand-planning" element={<NotFound />} />
          <Route path="/supply-planning" element={<NotFound />} />
          <Route path="/order-promising" element={<NotFound />} />
          <Route path="/factory-planning" element={<NotFound />} />
          <Route path="/inventory-optimization" element={<NotFound />} />
          <Route path="/inventory-liquidation" element={<NotFound />} />
          <Route path="/logistics" element={<NotFound />} />
          <Route path="/risk-management" element={<NotFound />} />
          <Route path="/analytics" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
