import { PublicLayout } from "@/components/layout/PublicLayout";
import { useEffect } from "react";

const QuemSomos = () => {
  useEffect(() => { document.title = "Quem Somos — Zero Utilitários"; }, []);
  return (
    <PublicLayout>
      <section className="bg-brand-black text-white py-16">
        <div className="container mx-auto px-4">
          <span className="text-primary font-bold tracking-widest text-sm">A EMPRESA</span>
          <h1 className="text-4xl md:text-5xl font-black mt-2">Quem Somos</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 max-w-3xl prose prose-neutral">
        <p className="text-lg text-muted-foreground leading-relaxed">
          A <strong>Zero Utilitários</strong> é referência no mercado de vans, furgões e utilitários 0KM em São Paulo.
          Localizada na Vila Maria, atendemos clientes de todo o estado com atendimento personalizado, condições especiais
          de financiamento e parceria com as principais montadoras do país.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Nossa missão é entregar o utilitário ideal para o seu negócio, com agilidade, transparência e o melhor pós-venda.
        </p>
      </section>
    </PublicLayout>
  );
};
export default QuemSomos;
