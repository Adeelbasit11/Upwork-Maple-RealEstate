import { useState } from "react";
import { Save, Shield, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { authAPI } from "@/lib/api";

export default function AdminSettings() {
  const ic = "w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary";

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true); setPwError(""); setPwSuccess("");
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setPwSuccess("Password updated successfully!");
      setCurrentPassword(""); setNewPassword("");
    } catch (err: any) {
      setPwError(err.response?.data?.message || "Failed to update password");
    } finally { setPwLoading(false); }
  };

  // General settings (static config — no backend model, saved to local UI only)
  const [saved, setSaved] = useState(false);
  const handleSaveGeneral = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-bold mb-6">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div><label className="text-xs text-muted-foreground">Site Name</label><input defaultValue="Maple Real Estate" className={ic} /></div>
            <div><label className="text-xs text-muted-foreground">Contact Email</label><input defaultValue="info@maplerealestate.pk" className={ic} /></div>
            <div><label className="text-xs text-muted-foreground">Phone</label><input defaultValue="+92 300 1234567" className={ic} /></div>
            <div><label className="text-xs text-muted-foreground">Address</label><input defaultValue="DHA Phase 6, Lahore" className={ic} /></div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold mb-4">Listings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Auto-approve listings</p><p className="text-xs text-muted-foreground">Skip manual approval for verified agents</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-muted-foreground/30 peer-checked:bg-primary rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Featured listings limit</p><p className="text-xs text-muted-foreground">Max featured properties on homepage</p></div>
              <input type="number" defaultValue={8} className="w-20 bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm text-center" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            {["New listing submitted", "New user registration", "New inquiry received"].map(item => (
              <div key={item} className="flex items-center justify-between">
                <p className="text-sm">{item}</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-muted-foreground/30 peer-checked:bg-primary rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {saved && <div className="p-3 bg-green-500/10 text-green-400 text-sm rounded-lg">Settings saved!</div>}

        <button onClick={handleSaveGeneral} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Save className="h-4 w-4" /> Save Settings
        </button>

        {/* Password Change */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold">Change Password</h2>
          </div>
          {pwSuccess && <div className="mb-4 p-3 bg-green-500/10 text-green-400 text-sm rounded-lg">{pwSuccess}</div>}
          {pwError && <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{pwError}</div>}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Current Password</label>
              <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className={ic} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">New Password</label>
              <input type="password" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className={ic} />
            </div>
            <button type="submit" disabled={pwLoading} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
              {pwLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
