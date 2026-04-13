import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Heart, User, ChevronDown, Home, Building2, Landmark, MapPin, LogOut, LayoutDashboard, Shield, Info, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Buy", href: "/properties?purpose=buy", icon: Home, sub: [
    { label: "Houses", href: "/properties?purpose=buy&type=house" },
    { label: "Apartments", href: "/properties?purpose=buy&type=apartment" },
    { label: "Plots", href: "/properties?purpose=buy&type=plot" },
    { label: "Villas", href: "/properties?purpose=buy&type=villa" },
  ]},
  { label: "Rent", href: "/properties?purpose=rent", icon: Building2, sub: [
    { label: "Houses", href: "/properties?purpose=rent&type=house" },
    { label: "Apartments", href: "/properties?purpose=rent&type=apartment" },
    { label: "Commercial", href: "/properties?purpose=rent&type=commercial" },
  ]},
  { label: "Commercial", href: "/properties?type=commercial", icon: Landmark },
  { label: "Agents", href: "/agents", icon: User },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
  { label: "Become an Agent", href: "/agent-register", icon: User },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "agent") return "/agent-dashboard";
    return "/dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Maple Real Estate" className="h-10 w-10" width={40} height={40} />
            <span className="font-heading font-bold text-xl hidden sm:block">Maple</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <div key={link.label} className="relative group"
                onMouseEnter={() => link.sub && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}>
                <Link to={link.href} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                  {link.sub && <ChevronDown className="h-3 w-3" />}
                </Link>
                {link.sub && openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 glass-card p-2 animate-fade-in">
                    {link.sub.map(s => (
                      <Link key={s.label} to={s.href} className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search properties..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground" />
          </form>

          <div className="flex items-center gap-2">
            <Link to="/favorites" className="p-2 text-muted-foreground hover:text-primary transition-colors" aria-label="Favorites">
              <Heart className="h-5 w-5" />
            </Link>

            {user ? (
              <div className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}>
                <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {user.name[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-52 glass-card p-2 animate-fade-in z-50">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link to={getDashboardLink()} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    {user.role === "agent" && user.isApproved && (
                      <Link to="/agent-dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                        <Building2 className="h-4 w-4" /> Agent Panel
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md">
                        <Shield className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md w-full">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Sign In
              </Link>
            )}

            <button className="lg:hidden p-2 text-muted-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border/50 py-4 animate-fade-in">
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 mb-4 md:hidden">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
            </form>
            {navLinks.map(link => (
              <div key={link.label}>
                <Link to={link.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <link.icon className="h-4 w-4" /> {link.label}
                </Link>
                {link.sub?.map(s => (
                  <Link key={s.label} to={s.href} onClick={() => setMobileOpen(false)} className="block pl-10 py-2 text-sm text-muted-foreground hover:text-foreground">
                    {s.label}
                  </Link>
                ))}
              </div>
            ))}
            {user ? (
              <>
                <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                {user.role === "agent" && user.isApproved && (
                  <Link to="/agent-dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                    <Building2 className="h-4 w-4" /> Agent Panel
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-destructive w-full">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block mx-3 mt-4 px-4 py-2 text-sm font-medium text-center bg-primary text-primary-foreground rounded-lg">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
