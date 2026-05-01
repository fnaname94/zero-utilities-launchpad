import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RequireAdmin } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus, Users, Star } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, ativos: 0, vendidos: 0, destaque: 0, users: 0 });

  useEffect(() => {
    document.title = "Painel — Zero Utilitários";
    (async () => {
      const [{ count: total }, { count: ativos }, { count: vendidos }, { count: destaque }, { count: users }] = await Promise.all([
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "ativo"),
        supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "vendido"),
        supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("featured", true),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      setStats({ total: total || 0, ativos: ativos || 0, vendidos: vendidos || 0, destaque: destaque || 0, users: users || 0 });
    })();
  }, []);

  const cards = [
    { l: "Veículos ativos", v: stats.ativos, icon: Truck, color: "bg-primary text-primary-foreground" },
    { l: "Em destaque", v: stats.destaque, icon: Star, color: "bg-brand-black text-white" },
    { l: "Vendidos", v: stats.vendidos, icon: Truck, color: "bg-muted text-foreground" },
    { l: "Usuários", v: stats.users, icon: Users, color: "bg-muted text-foreground" },
  ];

  return (
    <RequireAdmin>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black">Visão geral</h1>
          <p className="text-muted-foreground">Resumo do seu estoque e usuários.</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-glow font-bold">
          <Link to="/admin/veiculos/novo"><Plus className="w-4 h-4 mr-2" /> Novo veículo</Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.l} className="p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${c.color}`}><c.icon className="w-6 h-6" /></div>
            <div><div className="text-3xl font-black">{c.v}</div><div className="text-xs text-muted-foreground">{c.l}</div></div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h3 className="font-bold mb-2">Como começar</h3>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Cadastre veículos em <Link to="/admin/veiculos" className="text-primary underline">Veículos</Link>.</li>
          <li>Adicione fotos e marque como destaque para aparecer na home.</li>
          <li>Em <Link to="/admin/usuarios" className="text-primary underline">Usuários</Link>, libere acesso de admin para vendedores.</li>
        </ol>
      </Card>
    </RequireAdmin>
  );
};
export default Dashboard;
