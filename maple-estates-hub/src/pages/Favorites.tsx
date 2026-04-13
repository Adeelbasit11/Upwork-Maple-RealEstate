import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";
import { Property } from "@/types";
import { Heart, Loader2 } from "lucide-react";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const [saved, setSaved] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setSaved([]); setLoading(false); return; }
    setLoading(true);
    userAPI.getFavorites()
      .then(res => setSaved(res.data.data?.properties || []))
      .catch(() => setSaved([]))
      .finally(() => setLoading(false));
  }, [user, favorites]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-heading font-bold">Saved Properties</h1>
            <p className="text-sm text-muted-foreground">{saved.length} properties saved</p>
          </div>
        </div>
        {!user ? (
          <div className="glass-card p-12 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Please sign in to view your saved properties.</p>
            <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : saved.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No saved properties yet. Click the heart icon on any property to save it.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {saved.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
