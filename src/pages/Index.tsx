import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Wrench, CreditCard, Truck } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { VehicleCard, VehicleCardData } from "@/components/vehicles/VehicleCard";
import { supabase } from "@/integrations/supabase/client";

const banks = [
  { name: "Santander", logo: "/logo-santander.png" },
  { name: "Banco Daycoval", logo: "/logo-daycoval.png" },
  { name: "Omni", logo: "/logo-omni.png" },
  { name: "BV", logo: "/logo-bv.png" },
  { name: "Sicoob", logo: "/logo-sicoob.png" },
  { name: "Porto Seguro", logo: "/logo-porto.png" }
];

const Index = () => {
  const [featured, setFeatured] = useState<VehicleCardData[]>([]);

  useEffect(() => {
    document.title = "Zero Utilitários — Vans, Furgões e Utilitários 0KM em SP";
    supabase
      .from("vehicles")
      .select("id,brand,model,year,price,km,cover_image,category,featured")
      .eq("status", "ativo")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setFeatured(data || []));
  }, []);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center">
        <img src="/hero-bg.png" alt="Frota Zero Utilitários" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1024} />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-transparent" />
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl">
            <span className="text-primary font-bold tracking-[0.3em] text-sm uppercase mb-6 block animate-in fade-in slide-in-from-left-4 duration-700">Líder em Utilitários em São Paulo</span>
            <h1 className="font-black text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-white animate-in fade-in slide-in-from-left-6 duration-1000">
              O UTILITÁRIO QUE <br />
              <span className="text-primary italic">VOCÊ PRECISA</span> <br />
              ESTÁ AQUI.
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000">
              A maior variedade de vans, furgões e utilitários 0KM com aprovação de crédito facilitada e entrega imediata.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-in fade-in slide-in-from-left-10 duration-1000">
              <Button asChild size="lg" className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary-glow font-black text-lg shadow-yellow transition-all hover:scale-105">
                <Link to="/veiculos">VER ESTOQUE COMPLETO <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 border-2 border-white bg-transparent text-white hover:bg-white hover:text-brand-black font-bold text-lg backdrop-blur-sm transition-all">
                <Link to="/financiamentos">SIMULAR FINANCIAMENTO</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* FINANCING BAR */}
      <section className="bg-brand-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-light italic text-white/90 mb-8">
            Confira nossos <span className="text-primary not-italic font-bold">financiamentos</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {banks.map((b) => (
              <div key={b.name} className="bg-white rounded-lg p-5 flex justify-center items-center h-32 hover:scale-105 transition-transform cursor-pointer">
                <img src={b.logo} alt={`Logo ${b.name}`} className="max-h-20 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-bold tracking-widest text-sm">POR QUE A ZERO UTILITÁRIOS</span>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Tradição, variedade e o melhor preço</h2>
            <p className="text-muted-foreground mt-4">
              Através da nossa parceria com as principais montadoras, conseguimos excelentes preços e condições para você conquistar o utilitário dos seus sonhos.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Variedade 0KM", text: "Vans, furgões, caminhões, pickups e veículos escolares." },
              { icon: CreditCard, title: "Financiamento Fácil", text: "Parceria com os principais bancos e financeiras do país." },
              { icon: ShieldCheck, title: "Procedência Garantida", text: "Veículos novos direto da montadora, com garantia de fábrica." },
              { icon: Wrench, title: "Pós-venda Completo", text: "Suporte total após a compra, peças e manutenção." },
            ].map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-elevated transition-smooth">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <span className="text-primary font-bold tracking-widest text-sm">CONFIRA</span>
              <h2 className="text-3xl md:text-4xl font-black">Veículos em destaque</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/veiculos">Ver todos <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
          {featured.length === 0 ? (
            <div className="bg-muted rounded-lg p-12 text-center text-muted-foreground">
              Nenhum veículo cadastrado ainda. Acesse o painel admin para adicionar.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((v) => <VehicleCard key={v.id} v={v} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-yellow py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-brand-black">Pronto para tirar seu utilitário 0KM?</h2>
          <p className="mt-4 text-brand-black/80 max-w-xl mx-auto">Fale agora com um de nossos vendedores via WhatsApp.</p>
          <Button asChild size="lg" className="mt-6 bg-brand-black text-primary hover:bg-brand-dark font-bold">
            <a href="https://api.whatsapp.com/send?phone=5511999862636&text=Olá!" target="_blank" rel="noopener noreferrer">
              FALAR NO WHATSAPP
            </a>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
