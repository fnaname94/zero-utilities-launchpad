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
  { v: "pickup", l: "Pickup" }, { v: "escolar", l: "Escolar" }, { v: "passeio", l: "Carro de Passeio" }, { v: "outro", l: "Outro" },
];

const Veiculos = () => {
  const [list, setList] = useState<VehicleCardData[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [type, setType] = useState<"all" | "0km" | "semi" | "passeio">("all");
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
    
    if (cat !== "all" && type !== "passeio") qb = qb.eq("category", cat as any);
    if (type === "0km") qb = qb.eq("km", 0).neq("category", "passeio");
    if (type === "semi") qb = qb.gt("km", 0).neq("category", "passeio");
    if (type === "passeio") qb = qb.eq("category", "passeio");

    qb.then(({ data, error }) => {
      if (error) {
        console.error("Erro ao carregar veículos:", error);
        setList([]);
        setLoading(false);
        return;
      }
      let r = data || [];
      if (q) {
        const s = q.toLowerCase();
        r = r.filter((v) => `${v.brand} ${v.model}`.toLowerCase().includes(s));
      }
      setList(r);
      setLoading(false);
    }).catch((err) => {
      console.error("Exceção ao carregar veículos:", err);
      setList([]);
      setLoading(false);
    });
  }, [cat, q, type]);

  const selectType = (t: "0km" | "semi" | "passeio") => {
    setType(t);
    document.getElementById("lista-veiculos")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PublicLayout>
      <section className="bg-brand-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 uppercase tracking-wide">Veículos Zero Utilitários</h1>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Bloco 0KM */}
            <div className="bg-black flex flex-col items-center p-6 rounded-lg border border-white/10 hover:border-primary transition-colors">
              <div className="h-48 w-full flex items-center justify-center mb-6">
                <img src="/0km.png" alt="Utilitários 0KM" className="max-h-full object-contain" />
              </div>
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">
                <span className="text-primary">Utilitários</span> 0KM
              </h2>
              <button onClick={() => selectType("0km")} className="px-8 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold transition-colors">
                Visualizar
              </button>
            </div>

            {/* Bloco Semi-Novos */}
            <div className="bg-black flex flex-col items-center p-6 rounded-lg border border-white/10 hover:border-primary transition-colors">
              <div className="h-48 w-full flex items-center justify-center mb-6">
                <img src="/seminovo.png" alt="Utilitários Semi-Novos" className="max-h-full object-contain" />
              </div>
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">
                <span className="text-primary">Utilitários</span> SEMI-NOVOS
              </h2>
              <button onClick={() => selectType("semi")} className="px-8 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold transition-colors">
                Visualizar
              </button>
            </div>

            {/* Bloco Passeio */}
            <div className="bg-black flex flex-col items-center p-6 rounded-lg border border-white/10 hover:border-primary transition-colors">
              <div className="h-48 w-full flex items-center justify-center mb-6">
                <img src="/passeio.png" alt="Carros de Passeio" className="max-h-full object-contain" />
              </div>
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">
                <span className="text-primary">Carros</span> DE PASSEIO
              </h2>
              <button onClick={() => selectType("passeio")} className="px-8 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold transition-colors">
                Visualizar
              </button>
            </div>

          </div>
        </div>
      </section>

      <section id="lista-veiculos" className="py-10 bg-background">
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
            <div className="space-y-16">
              {cats.filter(c => c.v !== "all").map(c => {
                const categoryVehicles = list.filter(v => v.category === c.v);
                if (categoryVehicles.length === 0) return null;
                
                return (
                  <div key={c.v}>
                    <h2 className="text-2xl font-black mb-6 uppercase border-b-2 border-primary inline-block pb-1">
                      {c.l}
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryVehicles.map((v) => <VehicleCard key={v.id} v={v} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};
export default Veiculos;
