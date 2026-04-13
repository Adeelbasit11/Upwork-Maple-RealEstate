import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { cities, propertyTypes } from "@/data/mockData";
import { propertyAPI } from "@/lib/api";
import { Property } from "@/types";

export default function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const purpose = searchParams.get("purpose") || "";
  const city = searchParams.get("city") || "";
  const type = searchParams.get("type") || "";

  const [sort, setSort] = useState("latest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError("");
      try {
        const params: Record<string, string> = { limit: "50" };
        if (purpose) params.purpose = purpose;
        if (city) params.city = city;
        if (type) params.type = type;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (bedrooms) params.bedrooms = bedrooms;
        if (sort === "price-low") params.sort = "price";
        else if (sort === "price-high") params.sort = "-price";
        else params.sort = "-createdAt";

        const res = await propertyAPI.getAll(params);
        setProperties(res.data.data);
      } catch {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [purpose, city, type, sort, minPrice, maxPrice, bedrooms]);

  const selectClass = "bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm outline-none w-full";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Properties</h1>
            <p className="text-sm text-muted-foreground mt-1">{properties.length} properties found</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={e => setSort(e.target.value)} className={selectClass + " w-auto"}>
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="glass-card p-4 space-y-4 sticky top-20">
              <h3 className="font-heading font-semibold">Filters</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Min Price</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" className={selectClass} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Max Price</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Any" className={selectClass} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Bedrooms</label>
                <select value={bedrooms} onChange={e => setBedrooms(e.target.value)} className={selectClass}>
                  <option value="">Any</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={String(n)}>{n}+</option>)}
                </select>
              </div>
              <button onClick={() => { setMinPrice(""); setMaxPrice(""); setBedrooms(""); }}
                className="w-full py-2 text-sm text-primary hover:underline">Clear All</button>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="glass-card p-12 text-center">
                <p className="text-destructive">{error}</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-muted-foreground">No properties found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
