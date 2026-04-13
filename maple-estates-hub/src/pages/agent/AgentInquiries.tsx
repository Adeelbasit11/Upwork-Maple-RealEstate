import { useState, useEffect } from "react";
import { MessageSquare, Mail, Clock, Reply, Loader2 } from "lucide-react";
import AgentLayout from "@/components/AgentLayout";
import { agentDashboardAPI, inquiryAPI } from "@/lib/api";
import { Inquiry } from "@/types";

export default function AgentInquiries() {
  const [selected, setSelected] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    agentDashboardAPI.getInquiries()
      .then(res => setInquiries(res.data.data || []))
      .catch(() => setInquiries([]))
      .finally(() => setLoading(false));
  }, []);

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      await inquiryAPI.respond(id, replyText);
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, status: "responded" as const, response: replyText } : i));
      setReplyText("");
    } catch { /* ignore */ }
    setReplying(false);
  };

  if (loading) return <AgentLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AgentLayout>;

  return (
    <AgentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Inquiries</h1>
          <p className="text-sm text-muted-foreground">{inquiries.length} total inquiries • {inquiries.filter(m => m.status === "pending").length} pending</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2">
            {inquiries.length === 0 ? <p className="text-sm text-muted-foreground">No inquiries yet.</p> :
              inquiries.map(m => {
                const u = typeof m.user === "object" ? m.user : null;
                return (
                  <button key={m._id} onClick={() => setSelected(m._id)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${selected === m._id ? "bg-primary/10 border border-primary/30" : "glass-card hover:bg-muted/50"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium flex items-center gap-2">
                        {m.status === "pending" && <span className="w-2 h-2 bg-primary rounded-full" />}
                        {u?.name || "User"}
                      </p>
                      <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{m.message}</p>
                  </button>
                );
              })
            }
          </div>

          <div className="lg:col-span-2">
            {selected ? (() => {
              const msg = inquiries.find(m => m._id === selected);
              if (!msg) return null;
              const u = typeof msg.user === "object" ? msg.user : null;
              const prop = typeof msg.property === "object" ? msg.property : null;
              return (
                <div className="glass-card p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-heading font-semibold text-lg">{u?.name || "User"}</h2>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {u?.email || "N/A"}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(msg.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${msg.status === "responded" ? "bg-green-500/10 text-green-400" : "bg-primary/10 text-primary"}`}>
                      {msg.status === "responded" ? "Responded" : "Pending"}
                    </span>
                  </div>

                  {prop && <p className="text-sm text-primary">Property: {prop.title}</p>}

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>

                  {msg.response && (
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <p className="text-xs text-green-400 mb-1 font-medium">Your Reply:</p>
                      <p className="text-sm">{msg.response}</p>
                    </div>
                  )}

                  {msg.status === "pending" && (
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Reply</label>
                      <textarea rows={4} value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..." className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary resize-none" />
                      <button onClick={() => handleReply(msg._id)} disabled={replying} className="flex items-center gap-2 px-4 py-2 mt-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                        <Reply className="h-4 w-4" /> {replying ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="glass-card p-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select an inquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
