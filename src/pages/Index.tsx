import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Wrench, CreditCard, Truck } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { VehicleCard, VehicleCardData } from "@/components/vehicles/VehicleCard";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-fleet.jpg";

const banks = ["BV", "Santander", "Santana Financeira", "Omni", "Banco Daycoval", "Porto Seguro"];

const Index = () => {
  const [featured, setFeatured] = useState<VehicleCardData[]>([]);

  useEffect(() => {
    document.title = "Zero Utilitários — Vans, Furgões e Utilitários 0KM em SP";
    supabase
      .from("vehicles")
      .select("id,brand,model,year,price,km,cover_image,category,featured")
      .eq("status", "ativo")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setFeatured(data || []));
  }, []);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative">
        <img src={hero} alt="Frota Zero Utilitários" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1024} />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative container mx-auto px-4 py-24 md:py-36 text-center text-white">
          <h1 className="font-black text-4xl md:text-6xl lg:text-7xl leading-tight">
            COMPRE SEU UTILITÁRIO
            <span className="block mt-2">
              <span className="bg-primary text-primary-foreground px-4 py-1 inline-block rotate-[-1deg]">AGORA MESMO!</span>
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Vans, furgões e utilitários 0KM com as melhores condições de financiamento de São Paulo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary-glow font-bold shadow-yellow">
              <Link to="/veiculos">VER VEÍCULOS <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-black font-bold">
              <Link to="/financiamentos">FINANCIAMENTO</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FINANCING BAR */}
      <section className="bg-brand-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-light italic text-white/90 mb-8">
            Confira nossos <span className="text-primary not-italic font-bold">financiamentos</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {banks.map((b) => (
              <div key={b} className="text-white/70 hover:text-primary transition-smooth font-bold text-sm md:text-base text-center">
                {b}
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
