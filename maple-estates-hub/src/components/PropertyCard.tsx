import { Link } from "react-router-dom";
import { Heart, MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Property } from "@/types";
import { useFavorites } from "@/context/FavoritesContext";
import { UPLOADS_URL } from "@/lib/api";

const formatPrice = (p: number) => {
  if (p >= 10000000) return `PKR ${(p / 10000000).toFixed(1)} Cr`;
  if (p >= 100000) return `PKR ${(p / 100000).toFixed(1)} Lac`;
  return `PKR ${p.toLocaleString()}`;
};

export const getImageUrl = (src: string) => {
  if (!src) return "https://images.unsplash.com/photo-1564013799919?w=800&h=600&fit=crop";
  if (src.startsWith("http")) return src;
  return `${UPLOADS_URL}${src}`;
};

export { formatPrice };

export default function PropertyCard({ property }: { property: Property }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(property._id);

  return (
    <Link to={`/property/${property._id}`} className="block glass-card-hover overflow-hidden group">
      <div className="relative h-52 overflow-hidden">
        <img src={getImageUrl(property.images?.[0])} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md capitalize">{property.purpose}</span>
          <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-md capitalize">{property.type}</span>
        </div>
        <button onClick={e => { e.preventDefault(); toggleFavorite(property._id); }} className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${fav ? "bg-destructive text-destructive-foreground" : "bg-background/50 text-foreground hover:bg-destructive hover:text-destructive-foreground"}`} aria-label="Toggle favorite">
          <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
        </button>
        <div className="absolute bottom-3 left-3">
          <p className="text-lg font-heading font-bold">{formatPrice(property.price)}{property.purpose === "rent" ? "/mo" : ""}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-sm mb-1 line-clamp-1">{property.title}</h3>
        <p className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="h-3 w-3" /> {property.location}, {property.city}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {property.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {property.bedrooms}</span>}
          {property.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {property.bathrooms}</span>}
          {property.area > 0 && <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" /> {property.area} {property.areaUnit}</span>}
        </div>
      </div>
    </Link>
  );
}
