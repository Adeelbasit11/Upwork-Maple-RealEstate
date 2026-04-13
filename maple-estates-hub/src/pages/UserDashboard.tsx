import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Heart, Home, MessageSquare, LogOut, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { userAPI } from "@/lib/api";
import { Property, Inquiry } from "@/types";

export default function UserDashboard() {
  const { user, logout, updateUser } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    setProfileForm({ name: user.name, email: user.email, phone: user.phone || "" });
    Promise.all([
      userAPI.getFavorites().catch(() => ({ data: { data: { properties: [] } } })),
      userAPI.getInquiries().catch(() => ({ data: { data: [] } })),
    ]).then(([favRes, inqRes]) => {
      setSaved(favRes.data.data?.properties || []);
      setInquiries(inqRes.data.data || []);
    }).finally(() => setLoading(false));
  }, [user, favorites]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await userAPI.updateProfile({ name: profileForm.name, phone: profileForm.phone });
      updateUser(res.data.data);
    } catch {}
    setSaving(false);
  };

  if (!user) return null;
  if (loading) return <Layout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-heading font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="glass-card p-4 h-fit">
            <div className="text-center mb-6 p-4">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                {user.name[0]?.toUpperCase()}
              </div>
              <p className="font-heading font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <nav className="space-y-1">
              <button onClick={() => logout()} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </nav>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Saved", value: saved.length, icon: Heart },
                { label: "Inquiries", value: inquiries.length, icon: MessageSquare },
              ].map(s => (
                <div key={s.label} className="glass-card p-4 text-center">
                  <s.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-heading font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-6">
              <h2 className="font-heading font-semibold text-lg mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs text-muted-foreground">Name</label><input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm mt-1" /></div>
                <div><label className="text-xs text-muted-foreground">Email</label><input value={profileForm.email} disabled className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm mt-1 opacity-60" /></div>
                <div><label className="text-xs text-muted-foreground">Phone</label><input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm mt-1" /></div>
              </div>
              <button onClick={handleSaveProfile} disabled={saving} className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-lg mb-4">Saved Properties</h2>
              {saved.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved properties.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {saved.slice(0, 4).map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="font-heading font-semibold text-lg mb-4">My Inquiries</h2>
              {inquiries.length === 0 ? <p className="text-sm text-muted-foreground">No inquiries yet.</p> : (
                <div className="space-y-3">
                  {inquiries.slice(0, 5).map(inq => {
                    const prop = typeof inq.property === "object" ? inq.property : null;
                    return (
                      <div key={inq._id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          <MessageSquare className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{prop?.title || "Property"}</p>
                          <p className="text-xs text-muted-foreground truncate">{inq.message}</p>
                          {inq.response && <p className="text-xs text-green-400 mt-1">Reply: {inq.response}</p>}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${inq.status === "responded" ? "bg-green-500/10 text-green-400" : "bg-primary/10 text-primary"}`}>
                          {inq.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
