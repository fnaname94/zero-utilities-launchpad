import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Truck, Users, LogOut, ExternalLink } from "lucide-react";
import logo from "@/assets/logo.png";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const nav = useNavigate();

  const links = [
    { to: "/admin", end: true, icon: LayoutDashboard, label: "Visão geral" },
    { to: "/admin/veiculos", icon: Truck, label: "Veículos" },
    { to: "/admin/usuarios", icon: Users, label: "Usuários" },
  ];

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 bg-brand-black text-white flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <img src={logo} alt="Zero Utilitários" className="h-12 w-auto" />
          <p className="text-xs text-white/50 mt-2">Painel administrativo</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-smooth ${
                  isActive ? "bg-primary text-primary-foreground" : "text-white/80 hover:bg-white/10"
                }`
              }
            >
              <l.icon className="w-4 h-4" /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <div className="px-3 py-2 text-xs text-white/50 truncate">{user?.email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10" onClick={() => nav("/")}>
            <ExternalLink className="w-4 h-4 mr-2" /> Ver site
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto">
        <div className="md:hidden bg-brand-black text-white p-4 flex items-center justify-between">
          <img src={logo} alt="Zero" className="h-10" />
          <Button variant="ghost" size="sm" className="text-white" onClick={signOut}><LogOut className="w-4 h-4" /></Button>
        </div>
        <div className="md:hidden border-b bg-card overflow-x-auto">
          <div className="flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}
                className={({ isActive }) => `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${isActive ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>
                <l.icon className="w-4 h-4" /> {l.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Carregando…</div>;
  if (!user) { nav("/auth"); return null; }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-black mb-2">Sem acesso</h2>
          <p className="text-muted-foreground mb-6">Sua conta ainda não tem permissão de administrador. Peça a um admin para liberar seu acesso.</p>
          <Button onClick={() => nav("/")}>Voltar ao site</Button>
        </div>
      </div>
    );
  }
  return <AdminLayout>{children}</AdminLayout>;
};
