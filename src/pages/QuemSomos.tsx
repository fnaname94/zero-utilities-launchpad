import { PublicLayout } from "@/components/layout/PublicLayout";
import { useEffect } from "react";

const QuemSomos = () => {
  useEffect(() => { document.title = "Quem Somos — Zero Utilitários"; }, []);
  return (
    <PublicLayout>
      <section className="bg-brand-black text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-bold tracking-widest text-sm uppercase">Nossa História</span>
          <h1 className="text-4xl md:text-6xl font-black mt-2 mb-6">Quem Somos</h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* FOTO DA LOJA */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white animate-in fade-in slide-in-from-left-8 duration-1000">
            <img src="/loja.jpg" alt="Pátio da Zero Utilitários" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed bg-card p-8 rounded-2xl shadow-sm border border-border animate-in fade-in slide-in-from-right-8 duration-1000">
            <p>
              Somos da <strong className="text-foreground">Zero Utilitários</strong> e atuamos no mercado de Venda/Compra de Veículos Utilitários Novos e Usados.
            </p>
            <p>
              Família formada por grandes profissionais com muita competência e qualidade no atendimento. Nossos veículos são de excelente procedência e todos vistoriados antes de serem entregues aos nossos clientes evitando assim problemas e insatisfações.
            </p>
            <p>
              Venha conhecer a nossa loja, temos certeza que aqui você vai encontrar o veículo que procura com qualidade, preço e excelentes condições de financiamento.
            </p>
            <div className="bg-muted p-6 rounded-xl mt-8">
              <h3 className="text-foreground font-bold mb-2">Nosso atendimento:</h3>
              <p>de segunda a sexta-feira das 08:00 às 17:30<br/>e aos sábados das 08:00 às 14:00</p>
            </div>
            <p className="text-xl md:text-2xl text-center font-black text-foreground pt-6">
              ENTROU PARA A ZERO, VIROU AMIGO!!!
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-12 uppercase tracking-tight">Marcas que trabalhamos</h2>
          
          <div className="max-w-5xl mx-auto flex justify-center bg-white p-8 rounded-2xl shadow-sm">
             <img src="/marcas.png" alt="Peugeot, Renault, Mercedes, Fiat, Kia, Hyundai, Citroën" className="max-w-full h-auto" />
          </div>
          
        </div>
      </section>
    </PublicLayout>
  );
};
export default QuemSomos;
