import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Phone, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { agentAPI, UPLOADS_URL } from "@/lib/api";
import { Agent } from "@/types";

const getAvatarUrl = (avatar?: string) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${UPLOADS_URL}${avatar}`;
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentAPI.getAll()
      .then(res => setAgents(res.data.data))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Our Agents</h1>
        <p className="text-muted-foreground mb-8">Connect with verified real estate professionals</p>
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : agents.length === 0 ? (
          <div className="glass-card p-12 text-center"><p className="text-muted-foreground">No agents found.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <Link key={agent._id} to={`/agent/${agent._id}`} className="glass-card-hover p-6 text-center">
                {getAvatarUrl((agent as any).avatar) ? (
                  <img src={getAvatarUrl((agent as any).avatar)!} alt={agent.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                    {agent.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex items-center justify-center gap-1 mb-1">
                  <h3 className="font-heading font-semibold">{agent.name}</h3>
                  {agent.verified && <CheckCircle className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{agent.agency}</p>
                <p className="text-sm text-muted-foreground mb-4">{typeof agent.listings === "number" ? agent.listings : 0} listings</p>
                <span className="inline-flex items-center gap-1 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm">
                  <Phone className="h-3 w-3" /> Contact
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
