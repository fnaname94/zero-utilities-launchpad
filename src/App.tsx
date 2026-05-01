import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Veiculos from "./pages/Veiculos";
import VeiculoDetalhe from "./pages/VeiculoDetalhe";
import QuemSomos from "./pages/QuemSomos";
import Servicos from "./pages/Servicos";
import Financiamentos from "./pages/Financiamentos";
import Contato from "./pages/Contato";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import VeiculosList from "./pages/admin/VeiculosList";
import VeiculoForm from "./pages/admin/VeiculoForm";
import Usuarios from "./pages/admin/Usuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/veiculos" element={<Veiculos />} />
            <Route path="/veiculos/:id" element={<VeiculoDetalhe />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/financiamentos" element={<Financiamentos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/veiculos" element={<VeiculosList />} />
            <Route path="/admin/veiculos/novo" element={<VeiculoForm />} />
            <Route path="/admin/veiculos/:id" element={<VeiculoForm />} />
            <Route path="/admin/usuarios" element={<Usuarios />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
