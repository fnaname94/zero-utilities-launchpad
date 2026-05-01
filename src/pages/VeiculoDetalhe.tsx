import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Phone, Calendar, Gauge, Fuel, Settings, Users, Cog } from "lucide-react";
import { formatPrice, formatKm, categoryLabel } from "@/lib/format";

const VeiculoDetalhe = () => {
  const { id } = useParams();
  const [v, setV] = useState<any>(null);
  const [photos, setPhotos] = useState<{ url: string }[]>([]);
  const [main, setMain] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: vh } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
      const { data: ph } = await supabase.from("vehicle_photos").select("url,position").eq("vehicle_id", id).order("position");
      setV(vh);
      setPhotos(ph || []);
      setMain(vh?.cover_image || ph?.[0]?.url || null);
      if (vh) document.title = `${vh.brand} ${vh.model} ${vh.year} — Zero Utilitários`;
    })();
  }, [id]);

  if (!v) return <PublicLayout><div className="container mx-auto py-20 text-center text-muted-foreground">Carregando…</div></PublicLayout>;

  const waMsg = encodeURIComponent(`Olá! Tenho interesse no ${v.brand} ${v.model} ${v.year}.`);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/veiculos" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-smooth mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para veículos
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              {main ? <img src={main} alt={`${v.brand} ${v.model}`} className="w-full h-full object-cover" /> : null}
            </div>
            {photos.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {photos.map((p) => (
                  <button key={p.url} onClick={() => setMain(p.url)} className={`aspect-square rounded overflow-hidden border-2 transition-smooth ${main === p.url ? "border-primary" : "border-transparent"}`}>
                    <img src={p.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">{categoryLabel(v.category)}</span>
            <h1 className="text-3xl md:text-4xl font-black mt-3">{v.brand} {v.model}</h1>
            <p className="text-muted-foreground">{v.year} {v.color ? `• ${v.color}` : ""}</p>

            <div className="mt-6 p-6 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">A partir de</span>
              <p className="font-black text-4xl text-brand-black">{formatPrice(v.price)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
              {[
                [Calendar, "Ano", v.year],
                [Gauge, "KM", formatKm(v.km)],
                [Fuel, "Combustível", v.fuel || "—"],
                [Settings, "Câmbio", v.transmission || "—"],
                [Cog, "Motor", v.engine || "—"],
                [Users, "Lugares", v.seats || "—"],
              ].map(([Icon, l, val]: any) => (
                <div key={l} className="flex items-center gap-2 p-3 border border-border rounded">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div><div className="text-xs text-muted-foreground">{l}</div><div className="font-semibold">{val}</div></div>
                </div>
              ))}
            </div>

            {v.description && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{v.description}</p>
              </div>
            )}

            {v.features?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Opcionais</h3>
                <div className="flex flex-wrap gap-2">
                  {v.features.map((f: string) => (
                    <span key={f} className="text-xs bg-muted px-3 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary-glow font-bold">
                <a href={`https://api.whatsapp.com/send?phone=5511999862636&text=${waMsg}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1 font-bold">
                <a href="tel:+551126361000"><Phone className="w-5 h-5 mr-2" /> (11) 2636-1000</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
export default VeiculoDetalhe;
