import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";
import AgentLayout from "@/components/AgentLayout";
import { agentDashboardAPI, uploadAPI, UPLOADS_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const getAvatarUrl = (avatar?: string) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${UPLOADS_URL}${avatar}`;
};

export default function AgentProfileSettings() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    phone: "", agencyName: "", location: "", bio: "",
  });

  useEffect(() => {
    agentDashboardAPI.getProfile()
      .then(res => {
        const d = res.data.data;
        setForm({
          phone: d.phone || "",
          agencyName: d.agency || "",
          location: d.location || "",
          bio: d.bio || "",
        });
        setAvatarUrl(d.avatar || user?.avatar || null);
      })
      .catch(() => {
        if (user) setForm(f => ({ ...f, phone: user.phone || "" }));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
    try {
      const res = await uploadAPI.avatar(file);
      setAvatarUrl(res.data.data.imageUrl);
    } catch { setError("Avatar upload failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      const payload: Record<string, unknown> = { ...form };
      if (avatarUrl) payload.avatar = avatarUrl;
      const res = await agentDashboardAPI.updateProfile(payload);
      setSuccess("Profile updated successfully!");
      if (res.data.data?.user) {
        updateUser({ name: res.data.data.user.name, email: res.data.data.user.email, avatar: res.data.data.user.avatar, phone: res.data.data.user.phone });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
    setSaving(false);
  };

  if (loading) return <AgentLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AgentLayout>;

  return (
    <AgentLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-heading font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground">Update your agent profile information</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <label className="relative cursor-pointer group">
              {getAvatarUrl(avatarUrl || undefined) ? (
                <img src={getAvatarUrl(avatarUrl || undefined)!} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleAvatarChange} />
            </label>
            <div>
              <h2 className="font-heading font-semibold text-lg">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-500/10 text-green-400 text-sm rounded-lg">{success}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Agency</label>
                <input name="agencyName" value={form.agencyName} onChange={handleChange}
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Location</label>
                <input name="location" value={form.location} onChange={handleChange}
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </AgentLayout>
  );
}
