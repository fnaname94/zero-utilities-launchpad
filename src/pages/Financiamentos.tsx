import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Financiamentos = () => {
  useEffect(() => { document.title = "Financiamentos — Zero Utilitários"; }, []);
  const banks = [
    { name: "Santander", logo: "/logo-santander.png" },
    { name: "Banco Daycoval", logo: "/logo-daycoval.png" },
    { name: "Omni", logo: "/logo-omni.png" },
    { name: "BV", logo: "/logo-bv.png" },
    { name: "Santana Financeira", logo: "/logo-santana.png" },
    { name: "Porto Seguro", logo: "/logo-porto.png" }
  ];
  return (
    <PublicLayout>
      <section className="bg-brand-black text-white py-16">
        <div className="container mx-auto px-4">
          <span className="text-primary font-bold tracking-widest text-sm">CRÉDITO FACILITADO</span>
          <h1 className="text-4xl md:text-5xl font-black mt-2">Financiamentos</h1>
          <p className="text-white/70 mt-4 max-w-2xl">
            Trabalhamos com as principais financeiras do Brasil para que você consiga as melhores condições.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {banks.map((b) => (
            <div key={b.name} className="bg-card border border-border rounded-lg p-8 text-center shadow-card font-bold text-xl flex items-center justify-center min-h-[120px]">
              {b.logo ? (
                <img src={b.logo} alt={`Logo ${b.name}`} className="max-h-12 object-contain" />
              ) : (
                b.name
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary-glow font-bold">
            <a href="https://api.whatsapp.com/send?phone=5511999862636&text=Olá! Quero simular um financiamento." target="_blank" rel="noopener noreferrer">
              SIMULAR FINANCIAMENTO
            </a>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
};
export default Financiamentos;
