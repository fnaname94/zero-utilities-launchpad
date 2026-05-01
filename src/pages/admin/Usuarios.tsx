import { useEffect, useState } from "react";
import { RequireAdmin } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Usuarios = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: profs }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role").eq("role", "admin"),
    ]);
    setUsers(profs || []);
    setAdminIds(new Set((roles || []).map((r) => r.user_id)));
    setLoading(false);
  };
  useEffect(() => { document.title = "Usuários — Admin"; load(); }, []);

  const toggle = async (uid: string, makeAdmin: boolean) => {
    if (uid === user?.id && !makeAdmin) {
      toast.error("Você não pode remover seu próprio acesso de admin.");
      return;
    }
    if (makeAdmin) {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
      if (error) { toast.error(error.message); return; }
      toast.success("Admin liberado");
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", "admin");
      if (error) { toast.error(error.message); return; }
      toast.success("Acesso removido");
    }
    load();
  };

  return (
    <RequireAdmin>
      <h1 className="text-3xl font-black mb-2">Usuários</h1>
      <p className="text-muted-foreground mb-6">Libere acesso de administrador para vendedores e colaboradores.</p>

      {loading ? (
        <div className="text-muted-foreground">Carregando…</div>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase">
              <tr><th className="p-3">Nome</th><th className="p-3">Cadastrado em</th><th className="p-3 text-right">Admin</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="font-semibold">{u.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{u.id === user?.id ? "(você)" : ""}</div>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                  <td className="p-3 text-right">
                    <Switch checked={adminIds.has(u.id)} onCheckedChange={(v) => toggle(u.id, v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Card className="p-6 mt-6 bg-muted/40">
        <h3 className="font-bold mb-2">Como adicionar um novo admin</h3>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Peça para a pessoa criar uma conta em <code className="bg-background px-1 rounded">/auth</code>.</li>
          <li>Quando o nome dela aparecer aqui, ative o switch "Admin".</li>
        </ol>
      </Card>
    </RequireAdmin>
  );
};
export default Usuarios;
