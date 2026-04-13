import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { propertyAPI } from "@/lib/api";
import { Property } from "@/types";
import { Search, Loader2 } from "lucide-react";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setResults([]); setLoading(false); return; }
    setLoading(true);
    propertyAPI.getAll({ search: q, limit: "50" })
      .then(res => setResults(res.data.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Search className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-heading font-bold">Search Results</h1>
            <p className="text-sm text-muted-foreground">{results.length} results for "{q}"</p>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : results.length === 0 ? (
          <div className="glass-card p-12 text-center"><p className="text-muted-foreground">No properties match your search.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
