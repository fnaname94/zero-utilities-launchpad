import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RequireAdmin } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, categoryLabel } from "@/lib/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const VeiculosList = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setList(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar veículos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Veículos — Admin";
    load();
  }, []);

  const remove = async (id: string) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir: " + error.message);
      return;
    }
    toast.success("Veículo removido");
    load();
  };

  return (
    <RequireAdmin>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black">Veículos</h1>
          <p className="text-muted-foreground">{list.length} cadastrados</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary-glow font-bold">
          <Link to="/admin/veiculos/novo">
            <Plus className="w-4 h-4 mr-2" /> Novo veículo
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Carregando…</div>
      ) : list.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          Nenhum veículo ainda.{" "}
          <Link to="/admin/veiculos/novo" className="text-primary underline">
            Cadastrar o primeiro
          </Link>
          .
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase">
              <tr>
                <th className="p-3">Foto</th>
                <th className="p-3">Veículo</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Preço</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((v) => (
                <tr key={v.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="w-16 h-12 bg-muted rounded overflow-hidden">
                      {v.cover_image && (
                        <img src={v.cover_image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold flex items-center gap-2">
                      {v.brand} {v.model}
                      {v.featured && <Star className="w-3 h-3 fill-primary text-primary" />}
                    </div>
                    <div className="text-xs text-muted-foreground">{v.year}</div>
                  </td>
                  <td className="p-3">{categoryLabel(v.category)}</td>
                  <td className="p-3 font-semibold">{formatPrice(v.price)}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-bold ${
                        v.status === "ativo"
                          ? "bg-green-100 text-green-800"
                          : v.status === "vendido"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/admin/veiculos/${v.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir veículo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O veículo e suas referências serão removidos permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => remove(v.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </RequireAdmin>
  );
};
export default VeiculosList;

