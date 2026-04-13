import { useState, useEffect } from "react";
import { Mail, MailOpen, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { adminAPI } from "@/lib/api";
import { Inquiry } from "@/types";

export default function AdminMessages() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getInquiries()
      .then(res => setInquiries(res.data.data || []))
      .catch(() => setInquiries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-bold mb-6">Messages & Inquiries ({inquiries.length})</h1>

      {inquiries.length === 0 ? <p className="text-sm text-muted-foreground">No inquiries yet.</p> : (
        <div className="space-y-3">
          {inquiries.map(m => {
            const u = typeof m.user === "object" ? m.user : null;
            const prop = typeof m.property === "object" ? m.property : null;
            const isPending = m.status === "pending";
            return (
              <div key={m._id} className={`glass-card p-5 ${isPending ? "border-l-2 border-l-primary" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {isPending ? <Mail className="h-5 w-5 text-primary mt-0.5" /> : <MailOpen className="h-5 w-5 text-muted-foreground mt-0.5" />}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-heading font-semibold text-sm">{u?.name || "User"}</p>
                        {isPending && <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">Pending</span>}
                        {!isPending && <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">Responded</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{m.message}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{u?.email || "N/A"}</span>
                        {prop && <span>Property: {prop.title}</span>}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
