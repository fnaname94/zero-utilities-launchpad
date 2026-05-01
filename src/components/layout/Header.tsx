import { Link, NavLink, useNavigate } from "react-router-dom";
import { Phone, MessageCircle, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/", label: "HOME" },
  { to: "/quem-somos", label: "QUEM SOMOS" },
  { to: "/veiculos", label: "VEÍCULOS" },
  { to: "/servicos", label: "SERVIÇOS" },
  { to: "/financiamentos", label: "FINANCIAMENTOS" },
  { to: "/contato", label: "CONTATO" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50">
      {/* Top contact bar */}
      <div className="bg-brand-black text-white text-sm py-2 px-4">
        <div className="container mx-auto flex flex-wrap items-center justify-end gap-4 md:gap-8">
          <a
            href="https://api.whatsapp.com/send?phone=5511999862636&text=Olá!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-smooth"
          >
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Contato via WhatsApp — Clique aqui</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
          <a href="tel:+551126361000" className="flex items-center gap-2 hover:text-primary transition-smooth">
            <Phone className="w-4 h-4 text-primary" />
            <span className="font-bold">(11) 2636-1000</span>
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          <Link to="/" className="py-2 shrink-0">
            <img src={logo} alt="Zero Utilitários" className="h-16 md:h-20 w-auto" width={200} height={120} />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-bold tracking-wide transition-smooth rounded ${
                    isActive ? "bg-brand-black text-primary" : "text-brand-black hover:bg-brand-black hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAdmin && (
              <Button size="sm" variant="secondary" className="ml-2 gap-2" onClick={() => navigate("/admin")}>
                <LayoutDashboard className="w-4 h-4" /> Admin
              </Button>
            )}
            {user ? (
              <Button size="sm" variant="ghost" className="text-brand-black hover:bg-brand-black hover:text-primary" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            ) : null}
          </nav>

          <button
            className="lg:hidden p-2 text-brand-black"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {open && (
          <nav className="lg:hidden bg-brand-black text-white border-t-4 border-primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-3 text-sm font-bold tracking-wide border-b border-white/10 ${
                    isActive ? "text-primary" : "text-white hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" onClick={() => setOpen(false)} className="block px-6 py-3 text-sm font-bold text-primary border-b border-white/10">
                PAINEL ADMIN
              </NavLink>
            )}
            {user && (
              <button onClick={() => { signOut(); setOpen(false); }} className="block w-full text-left px-6 py-3 text-sm font-bold text-white hover:text-primary">
                SAIR
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
