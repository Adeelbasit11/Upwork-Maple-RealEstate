import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Phone, Mail, CheckCircle, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { agentAPI, UPLOADS_URL } from "@/lib/api";
import { Agent, Property } from "@/types";

const getAvatarUrl = (avatar?: string) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${UPLOADS_URL}${avatar}`;
};

export default function AgentProfilePage() {
  const { id } = useParams();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    agentAPI.getById(id)
      .then(res => setAgent(res.data.data))
      .catch(() => setAgent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;
  if (!agent) return <Layout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-heading font-bold">Agent not found</h1></div></Layout>;

  const agentListings = Array.isArray(agent.listings) ? agent.listings as Property[] : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {getAvatarUrl((agent as any).avatar) ? (
              <img src={getAvatarUrl((agent as any).avatar)!} alt={agent.name} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                {agent.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-heading font-bold">{agent.name}</h1>
                {agent.verified && <CheckCircle className="h-5 w-5 text-primary" />}
              </div>
              <p className="text-muted-foreground mb-3">{agent.agency}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span>{agentListings.length} listings</span>
                {agent.experience > 0 && <span>{agent.experience} years experience</span>}
              </div>
              {agent.bio && <p className="text-sm text-muted-foreground mb-4">{agent.bio}</p>}
              <div className="flex gap-3">
                {agent.phone && <a href={`tel:${agent.phone}`} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"><Phone className="h-4 w-4" /> Call</a>}
                {agent.email && <a href={`mailto:${agent.email}`} className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm font-medium hover:bg-muted"><Mail className="h-4 w-4" /> Email</a>}
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-heading font-bold mb-6">Listings by {agent.name}</h2>
        {agentListings.length === 0 ? (
          <p className="text-muted-foreground">No listings available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentListings.map((p: Property) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
