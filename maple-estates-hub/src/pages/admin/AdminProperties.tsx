import { useState, useEffect } from "react";
import { Search, Trash2, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { formatPrice } from "@/components/PropertyCard";
import { adminAPI } from "@/lib/api";
import { Property } from "@/types";

export default function AdminProperties() {
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getProperties()
      .then(res => setProperties(res.data.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    try { await adminAPI.deleteProperty(id); setProperties(prev => prev.filter(p => p._id !== id)); } catch {}
  };

  const filtered = properties.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Properties ({properties.length})</h1>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search properties..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1" />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Property</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Type</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">City</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Price</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Status</th>
                <th className="text-right p-4 text-xs text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="p-4 font-medium max-w-[200px] truncate">{p.title}</td>
                  <td className="p-4 capitalize">{p.type}</td>
                  <td className="p-4">{p.city}</td>
                  <td className="p-4">{formatPrice(p.price)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${p.isApproved ? "bg-green-500/10 text-green-400" : "bg-accent/10 text-accent"}`}>
                      {p.isApproved ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/property/${p._id}`} className="p-1.5 text-muted-foreground hover:text-foreground rounded"><Eye className="h-4 w-4" /></Link>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
