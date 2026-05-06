import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-brand-black text-white mt-16">
    <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
      <div>
        <h3 className="text-primary font-black text-xl mb-4">ZERO UTILITÁRIOS</h3>
        <p className="text-white/70 text-sm leading-relaxed">
          Especialistas em vans, furgões e utilitários 0KM em São Paulo. Parceria com as principais montadoras e financiamentos facilitados.
        </p>
      </div>
      <div>
        <h4 className="text-primary font-bold mb-4">CONTATO</h4>
        <ul className="space-y-3 text-sm text-white/80">
          <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" /> R. Matias Ferrão, 26 — Vila Maria, São Paulo</li>
          <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> (11) 2636-1000</li>
          <li className="flex items-center gap-3"><MessageCircle className="w-4 h-4 text-primary" /> WhatsApp: (11) 99986-2636</li>
          <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> zero.utilitarios@gmail.com</li>
        </ul>
      </div>
      <div>
        <h4 className="text-primary font-bold mb-4">NAVEGAÇÃO</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/veiculos" className="text-white/80 hover:text-primary transition-smooth">Veículos</Link></li>
          <li><Link to="/financiamentos" className="text-white/80 hover:text-primary transition-smooth">Financiamentos</Link></li>
          <li><Link to="/quem-somos" className="text-white/80 hover:text-primary transition-smooth">Quem Somos</Link></li>
          <li><Link to="/contato" className="text-white/80 hover:text-primary transition-smooth">Contato</Link></li>
          <li><Link to="/auth" className="text-white/50 hover:text-primary transition-smooth text-xs">Área restrita</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
      © {new Date().getFullYear()} Zero Utilitários. Todos os direitos reservados.
    </div>
  </footer>
);
