import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { VehicleCard, VehicleCardData } from "@/components/vehicles/VehicleCard";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const cats = [
  { v: "all", l: "Todas as categorias" },
  { v: "van", l: "Van" }, { v: "furgao", l: "Furgão" }, { v: "caminhao", l: "Caminhão" },
  { v: "pickup", l: "Pickup" }, { v: "escolar", l: "Escolar" }, { v: "outro", l: "Outro" },
];

const Veiculos = () => {
  const [list, setList] = useState<VehicleCardData[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { document.title = "Veículos — Zero Utilitários"; }, []);

  useEffect(() => {
    setLoading(true);
    let qb = supabase
      .from("vehicles")
      .select("id,brand,model,year,price,km,cover_image,category,featured")
      .eq("status", "ativo")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (cat !== "all") qb = qb.eq("category", cat as any);
    qb.then(({ data }) => {
      let r = data || [];
      if (q) {
        const s = q.toLowerCase();
        r = r.filter((v) => `${v.brand} ${v.model}`.toLowerCase().includes(s));
      }
      setList(r);
      setLoading(false);
    });
  }, [cat, q]);

  return (
    <PublicLayout>
      <section className="bg-brand-black text-white py-16">
        <div className="container mx-auto px-4">
          <span className="text-primary font-bold tracking-widest text-sm">NOSSO ESTOQUE</span>
          <h1 className="text-4xl md:text-5xl font-black mt-2">Veículos disponíveis</h1>
          <p className="text-white/70 mt-3 max-w-2xl">Encontre o utilitário ideal para o seu negócio.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por marca ou modelo…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="md:w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                {cats.map((c) => <SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Carregando…</div>
          ) : list.length === 0 ? (
            <div className="bg-muted rounded-lg p-12 text-center text-muted-foreground">
              Nenhum veículo encontrado.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((v) => <VehicleCard key={v.id} v={v} />)}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};
export default Veiculos;
