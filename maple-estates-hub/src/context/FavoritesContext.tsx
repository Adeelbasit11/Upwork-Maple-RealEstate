import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { wishlistAPI } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from API when logged in
  useEffect(() => {
    if (user) {
      setLoading(true);
      wishlistAPI
        .get()
        .then((res) => {
          const ids = (res.data.data?.properties || []).map((p: { _id: string }) => p._id);
          setFavorites(ids);
        })
        .catch(() => setFavorites([]))
        .finally(() => setLoading(false));
    } else {
      setFavorites([]);
    }
  }, [user]);

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!user) return;
      const isFav = favorites.includes(id);
      // Optimistic update
      setFavorites((prev) =>
        isFav ? prev.filter((f) => f !== id) : [...prev, id]
      );
      try {
        if (isFav) {
          await wishlistAPI.remove(id);
        } else {
          await wishlistAPI.add(id);
        }
      } catch {
        // Revert on error
        setFavorites((prev) =>
          isFav ? [...prev, id] : prev.filter((f) => f !== id)
        );
      }
    },
    [user, favorites]
  );

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
