import { useState } from "react";
import { Bell, Shield, Eye, Loader2 } from "lucide-react";
import AgentLayout from "@/components/AgentLayout";
import { authAPI } from "@/lib/api";

export default function AgentSettings() {
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

  const ic = "w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary";

  return (
    <AgentLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-heading font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account preferences</p>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Email notifications for new inquiries", desc: "Get notified when someone inquires about your property" },
              { label: "SMS notifications", desc: "Receive text messages for urgent updates" },
              { label: "Marketing emails", desc: "Tips, market insights, and platform updates" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                  <div className="w-9 h-5 bg-muted-foreground/30 peer-checked:bg-primary rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold">Privacy</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Show phone number on listings", desc: "Allow users to see your phone number" },
              { label: "Show email on profile", desc: "Display email on your public agent profile" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-muted-foreground/30 peer-checked:bg-primary rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold">Security</h2>
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

        {/* Danger */}
        <div className="glass-card p-6 border border-destructive/20">
          <h2 className="font-heading font-semibold text-destructive mb-2">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back.</p>
          <button className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </AgentLayout>
  );
}
