import { PublicLayout } from "@/components/layout/PublicLayout";
import { useEffect } from "react";
import { Wrench, Truck, ShieldCheck, CreditCard } from "lucide-react";

const Servicos = () => {
  useEffect(() => { document.title = "Serviços — Zero Utilitários"; }, []);
  const items = [
    { icon: Truck, t: "Venda de utilitários 0KM", d: "Vans, furgões, caminhões, pickups e veículos escolares novos." },
    { icon: CreditCard, t: "Financiamento", d: "Parceria com BV, Santander, Omni, Daycoval, Porto Seguro e mais." },
    { icon: ShieldCheck, t: "Documentação", d: "Cuidamos de toda a parte burocrática para você." },
    { icon: Wrench, t: "Pós-venda", d: "Suporte completo e indicação de oficinas autorizadas." },
  ];
  return (
    <PublicLayout>
      <section className="bg-brand-black text-white py-16">
        <div className="container mx-auto px-4">
          <span className="text-primary font-bold tracking-widest text-sm">O QUE OFERECEMOS</span>
          <h1 className="text-4xl md:text-5xl font-black mt-2">Serviços</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 grid sm:grid-cols-2 gap-6">
        {items.map((i) => (
          <div key={i.t} className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
              <i.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-2">{i.t}</h3>
            <p className="text-muted-foreground">{i.d}</p>
          </div>
        ))}
      </section>
    </PublicLayout>
  );
};
export default Servicos;
