import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import AgentLayout from "@/components/AgentLayout";
import { formatPrice, getImageUrl } from "@/components/PropertyCard";
import { userAPI, propertyAPI } from "@/lib/api";
import { Property } from "@/types";

export default function AgentListings() {
  const [filter, setFilter] = useState("all");
  const [myListings, setMyListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getMyProperties()
      .then(res => setMyListings(res.data.data || []))
      .catch(() => setMyListings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    try {
      await propertyAPI.delete(id);
      setMyListings(prev => prev.filter(p => p._id !== id));
    } catch { /* ignore */ }
  };

  const filtered = filter === "all" ? myListings : filter === "active" ? myListings.filter(p => p.isApproved) : myListings.filter(p => !p.isApproved);

  if (loading) return <AgentLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AgentLayout>;

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">My Listings</h1>
            <p className="text-sm text-muted-foreground">{myListings.length} total properties</p>
          </div>
          <Link to="/agent-dashboard/add-property" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> Add Property
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {["all", "active", "pending"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}>
              {f} {f === "all" ? `(${myListings.length})` : f === "active" ? `(${myListings.filter(p => p.isApproved).length})` : `(${myListings.filter(p => !p.isApproved).length})`}
            </button>
          ))}
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search listings..." className="bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary w-48" />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-muted-foreground font-medium">Property</th>
                  <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Location</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Price</th>
                  <th className="text-left p-4 text-muted-foreground font-medium hidden sm:table-cell">Type</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={getImageUrl(p.images?.[0])} alt={p.title} className="w-12 h-12 rounded-lg object-cover" loading="lazy" />
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[200px]">{p.title}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{p.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{p.location}, {p.city}</td>
                    <td className="p-4 font-medium">{formatPrice(p.price)}</td>
                    <td className="p-4 capitalize text-muted-foreground hidden sm:table-cell">{p.type}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${p.isApproved ? "bg-green-500/10 text-green-400" : "bg-accent/10 text-accent"}`}>
                        {p.isApproved ? "Active" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/property/${p._id}`} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50"><Eye className="h-4 w-4" /></Link>
                        <button className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted/50"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted/50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
