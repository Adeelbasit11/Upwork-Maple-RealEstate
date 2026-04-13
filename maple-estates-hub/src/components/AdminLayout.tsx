import { useState, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building, Users, UserCheck, CheckSquare, MessageSquare, Settings, Menu, X, LogOut, ChevronLeft } from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Building },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Agents", href: "/admin/agents", icon: UserCheck },
  { label: "Approvals", href: "/admin/approvals", icon: CheckSquare },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-secondary border-r border-border/50 flex flex-col transition-all duration-300 shrink-0 hidden lg:flex`}>
        <div className="p-4 flex items-center gap-3 border-b border-border/50">
          <img src={logo} alt="Maple" className="h-8 w-8" width={32} height={32} />
          {sidebarOpen && <span className="font-heading font-bold">Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="ml-auto text-muted-foreground hover:text-foreground">
            <ChevronLeft className={`h-4 w-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border/50">
          <Link to="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50`}>
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-secondary border-b border-border/50">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground"><Menu className="h-5 w-5" /></button>
          <span className="font-heading font-bold">Admin</span>
        </header>

        {/* Mobile nav overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <div className="w-64 h-full bg-secondary border-r border-border/50 p-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <span className="font-heading font-bold">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
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
