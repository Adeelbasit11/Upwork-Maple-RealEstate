import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building, MessageSquare, PlusCircle, User, Settings, Menu, X, LogOut, ChevronLeft, Star, Eye } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { agentDashboardAPI, UPLOADS_URL } from "@/lib/api";

const navItems = [
  { label: "Dashboard", href: "/agent-dashboard", icon: LayoutDashboard },
  { label: "My Listings", href: "/agent-dashboard/listings", icon: Building },
  { label: "Add Property", href: "/agent-dashboard/add-property", icon: PlusCircle },
  { label: "Inquiries", href: "/agent-dashboard/inquiries", icon: MessageSquare },
  { label: "Reviews", href: "/agent-dashboard/reviews", icon: Star },
  { label: "Profile", href: "/agent-dashboard/profile", icon: User },
  { label: "Settings", href: "/agent-dashboard/settings", icon: Settings },
];

const getAvatar = (avatar?: string) => {
  if (!avatar) return null;
  if (avatar.startsWith("http")) return avatar;
  return `${UPLOADS_URL}${avatar}`;
};

export default function AgentLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuth();
  const [agentProfile, setAgentProfile] = useState<any>(null);

  useEffect(() => {
    agentDashboardAPI.getProfile()
      .then(res => setAgentProfile(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-secondary border-r border-border/50 flex flex-col transition-all duration-300 shrink-0 hidden lg:flex`}>
        <div className="p-4 flex items-center gap-3 border-b border-border/50">
          <img src={logo} alt="Maple" className="h-8 w-8" width={32} height={32} />
          {sidebarOpen && <span className="font-heading font-bold text-primary">Agent Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-muted-foreground hover:text-foreground">
            <ChevronLeft className={`h-4 w-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Agent Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              {getAvatar(agentProfile?.avatar || user?.avatar) ? (
                <img src={getAvatar(agentProfile?.avatar || user?.avatar)!} alt="Agent" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {(agentProfile?.name || user?.name)?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-heading font-semibold truncate">{agentProfile?.name || user?.name}</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Verified Agent
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border/50 space-y-1">
          <Link to={`/agent/${agentProfile?._id || ""}`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
            <Eye className="h-4 w-4" />
            {sidebarOpen && <span>View Public Profile</span>}
          </Link>
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50">
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-secondary border-b border-border/50">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground"><Menu className="h-5 w-5" /></button>
          <span className="font-heading font-bold text-primary">Agent Panel</span>
        </header>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <div className="w-64 h-full bg-secondary border-r border-border/50 p-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-bold text-primary">Agent Panel</span>
                <button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
              </div>
              <div className="flex items-center gap-3 mb-6 p-3 bg-muted/30 rounded-lg">
                {getAvatar(agentProfile?.avatar || user?.avatar) ? (
                  <img src={getAvatar(agentProfile?.avatar || user?.avatar)!} alt="Agent" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {(agentProfile?.name || user?.name)?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{agentProfile?.name || user?.name}</p>
                  <p className="text-xs text-green-400">Verified Agent</p>
                </div>
              </div>
              <nav className="space-y-1">
                {navItems.map(item => (
                  <Link key={item.href} to={item.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${location.pathname === item.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                    <item.icon className="h-4 w-4" /> {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
