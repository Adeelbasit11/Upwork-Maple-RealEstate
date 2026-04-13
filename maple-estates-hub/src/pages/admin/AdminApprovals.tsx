import { useState, useEffect } from "react";
import { Check, X, Eye, UserCheck, Building, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { formatPrice, getImageUrl } from "@/components/PropertyCard";
import { adminAPI, UPLOADS_URL } from "@/lib/api";
import { Property, Agent } from "@/types";

const getAvatarUrl = (avatar?: string) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${UPLOADS_URL}${avatar}`;
};

type Tab = "properties" | "agents";

export default function AdminApprovals() {
  const [tab, setTab] = useState<Tab>("properties");
  const [pendingProps, setPendingProps] = useState<Property[]>([]);
  const [pendingAgents, setPendingAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getPendingProperties(), adminAPI.getPendingAgents()])
      .then(([pRes, aRes]) => {
        setPendingProps(pRes.data.data || []);
        setPendingAgents(aRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApproveProperty = async (id: string) => {
    await adminAPI.approveProperty(id);
    setPendingProps(prev => prev.filter(p => p._id !== id));
  };
  const handleRejectProperty = async (id: string) => {
    await adminAPI.rejectProperty(id);
    setPendingProps(prev => prev.filter(p => p._id !== id));
  };
  const handleApproveAgent = async (id: string) => {
    await adminAPI.approveAgent(id);
    setPendingAgents(prev => prev.filter(a => a._id !== id));
  };
  const handleRejectAgent = async (id: string) => {
    await adminAPI.rejectAgent(id);
    setPendingAgents(prev => prev.filter(a => a._id !== id));
  };

  if (loading) return <AdminLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-bold mb-2">Approvals</h1>
      <p className="text-sm text-muted-foreground mb-6">Review and approve pending listings and agent applications</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("properties")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "properties" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}>
          <Building className="h-4 w-4" /> Properties ({pendingProps.length})
        </button>
        <button onClick={() => setTab("agents")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "agents" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}>
          <UserCheck className="h-4 w-4" /> Agents ({pendingAgents.length})
        </button>
      </div>

      {tab === "properties" ? (
        <div className="space-y-4">
          {pendingProps.length === 0 ? <p className="text-sm text-muted-foreground">No pending properties.</p> :
            pendingProps.map(p => (
              <div key={p._id} className="glass-card p-4 flex flex-col md:flex-row gap-4">
                <img src={getImageUrl(p.images?.[0])} alt={p.title} className="w-full md:w-40 h-28 object-cover rounded-lg" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{p.location}, {p.city}</p>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span className="capitalize">{p.type}</span>
                    <span>{formatPrice(p.price)}</span>
                    {p.bedrooms > 0 && <span>{p.bedrooms} beds</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleApproveProperty(p._id)} className="flex items-center gap-1 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/20">
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button onClick={() => handleRejectProperty(p._id)} className="flex items-center gap-1 px-3 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20">
                    <X className="h-4 w-4" /> Reject
                  </button>
                  <Link to={`/property/${p._id}`} className="p-2 text-muted-foreground hover:text-foreground"><Eye className="h-4 w-4" /></Link>
                </div>
              </div>
            ))
          }
        </div>
      ) : (
        <div className="space-y-4">
          {pendingAgents.length === 0 ? <p className="text-sm text-muted-foreground">No pending agent applications.</p> :
            pendingAgents.map(agent => (
              <div key={agent._id} className="glass-card p-5 flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {getAvatarUrl(agent.avatar) ? (
                    <img src={getAvatarUrl(agent.avatar)!} alt={agent.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                      {agent.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.agency} • {agent.location}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                      <span>{agent.email}</span>
                      <span>{agent.phone}</span>
                      <span>{agent.experience} years experience</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleApproveAgent(agent._id)} className="flex items-center gap-1 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/20">
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button onClick={() => handleRejectAgent(agent._id)} className="flex items-center gap-1 px-3 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20">
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </AdminLayout>
  );
}
