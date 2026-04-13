import { useState, useEffect } from "react";
import { CheckCircle, Phone, Mail, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { adminAPI, UPLOADS_URL } from "@/lib/api";
import { Agent } from "@/types";

const getAvatarUrl = (avatar?: string) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${UPLOADS_URL}${avatar}`;
};

export default function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAgents()
      .then(res => setAgents(res.data.data || []))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-bold mb-6">Agents ({agents.length})</h1>

      {agents.length === 0 ? <p className="text-sm text-muted-foreground">No agents found.</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <div key={agent._id} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-4">
                {getAvatarUrl(agent.avatar) ? (
                  <img src={getAvatarUrl(agent.avatar)!} alt={agent.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">{agent.name?.[0]?.toUpperCase()}</div>
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-heading font-semibold">{agent.name}</p>
                    {agent.verified && <CheckCircle className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.agency}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>{agent.experience} years exp</span>
                <span>{typeof agent.listings === "number" ? agent.listings : 0} listings</span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> {agent.phone}</p>
                <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> {agent.email}</p>
              </div>
              <div className="flex gap-2">
                {agent.verified ? (
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-md text-xs font-medium">Verified</span>
                ) : (
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium">Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
