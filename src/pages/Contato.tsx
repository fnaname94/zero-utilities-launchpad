import { PublicLayout } from "@/components/layout/PublicLayout";
import { useEffect } from "react";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";

const Contato = () => {
  useEffect(() => { document.title = "Contato — Zero Utilitários"; }, []);
  return (
    <PublicLayout>
      <section className="bg-brand-black text-white py-16">
        <div className="container mx-auto px-4">
          <span className="text-primary font-bold tracking-widest text-sm">FALE CONOSCO</span>
          <h1 className="text-4xl md:text-5xl font-black mt-2">Contato</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          {[
            { icon: MapPin, t: "Endereço", d: "R. Matias Ferrão, 26 — Vila Maria, São Paulo/SP" },
            { icon: Phone, t: "Telefone", d: "(11) 2636-1000", href: "tel:+551126361000" },
            { icon: MessageCircle, t: "WhatsApp", d: "(11) 99986-2636", href: "https://api.whatsapp.com/send?phone=5511999862636&text=Olá!" },
            { icon: Mail, t: "Email", d: "contato@zeroutilitarios.com.br", href: "mailto:contato@zeroutilitarios.com.br" },
          ].map((i) => (
            <a key={i.t} href={i.href || "#"} target={i.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <i.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold">{i.t}</h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-smooth">{i.d}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="rounded-lg overflow-hidden shadow-card aspect-square md:aspect-auto bg-muted">
          <iframe
            title="Mapa Zero Utilitários"
            src="https://www.google.com/maps?q=R.+Matias+Ferrão,+26,+Vila+Maria,+São+Paulo&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </section>
    </PublicLayout>
  );
};
export default Contato;
