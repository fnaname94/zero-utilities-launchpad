import { Link } from "react-router-dom";
import { Car, Gauge, Calendar } from "lucide-react";
import { formatPrice, formatKm, categoryLabel } from "@/lib/format";

export interface VehicleCardData {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number | null;
  km: number | null;
  cover_image: string | null;
  category: string;
  featured?: boolean;
}

export const VehicleCard = ({ v }: { v: VehicleCardData }) => (
  <Link
    to={`/veiculos/${v.id}`}
    className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-smooth border border-border"
  >
    <div className="aspect-[4/3] bg-muted overflow-hidden relative">
      {v.cover_image ? (
        <img
          src={v.cover_image}
          alt={`${v.brand} ${v.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <Car className="w-16 h-16" />
        </div>
      )}
      {v.featured && (
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
          DESTAQUE
        </span>
      )}
      <span className="absolute top-3 right-3 bg-brand-black/80 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur">
        {categoryLabel(v.category)}
      </span>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg leading-tight">{v.brand} {v.model}</h3>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {v.year}</span>
        <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {formatKm(v.km)}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">A partir de</span>
        <p className="font-black text-xl text-brand-black">{formatPrice(v.price)}</p>
      </div>
    </div>
  </Link>
);
