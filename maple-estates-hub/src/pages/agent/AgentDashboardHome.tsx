import { useState, useEffect } from "react";
import { Building, MessageSquare, Loader2, CheckCircle, Clock, PlusCircle, Eye, TrendingUp, ArrowUpRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import AgentLayout from "@/components/AgentLayout";
import { getImageUrl, formatPrice } from "@/components/PropertyCard";
import { userAPI, agentDashboardAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Property, Inquiry } from "@/types";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AgentDashboardHome() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [listRes, inqRes] = await Promise.all([
          userAPI.getMyProperties(),
          agentDashboardAPI.getInquiries(),
        ]);
        setMyListings(listRes.data.data || []);
        setInquiries(inqRes.data.data || []);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <AgentLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AgentLayout>;

  const activeListings = myListings.filter(p => p.isApproved);
  const pendingListings = myListings.filter(p => !p.isApproved);
  const pendingInquiries = inquiries.filter(i => i.status === "pending");
  const respondedInquiries = inquiries.filter(i => i.status === "responded");

  // Chart data: property type breakdown
  const typeMap: Record<string, number> = {};
  myListings.forEach(p => { typeMap[p.type] = (typeMap[p.type] || 0) + 1; });
  const typeData = Object.entries(typeMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Chart data: city breakdown
  const cityMap: Record<string, number> = {};
  myListings.forEach(p => { cityMap[p.city] = (cityMap[p.city] || 0) + 1; });
  const cityData = Object.entries(cityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, listings: count }));

  // Chart data: purpose split
  const purposeData = [
    { name: "For Sale", value: myListings.filter(p => p.purpose === "buy").length },
    { name: "For Rent", value: myListings.filter(p => p.purpose === "rent").length },
  ].filter(d => d.value > 0);

  // Total estimated value
  const totalValue = myListings.reduce((sum, p) => sum + p.price, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  };

  const statCards = [
    { label: "Total Listings", value: myListings.length, icon: Building, color: "text-blue-400", bg: "bg-blue-500/10", sub: `${formatPrice(totalValue)} total value` },
    { label: "Active Listings", value: activeListings.length, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", sub: "live on platform" },
    { label: "Pending Approval", value: pendingListings.length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", sub: "awaiting review" },
    { label: "Total Inquiries", value: inquiries.length, icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10", sub: `${pendingInquiries.length} new` },
  ];

  return (
    <AgentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-sm text-muted-foreground mt-1">Here's your performance overview</p>
          </div>
          <Link to="/agent-dashboard/add-property" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <PlusCircle className="h-4 w-4" /> Add Property
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(card => (
            <div key={card.label} className="glass-card p-5 hover:border-border transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-3xl font-heading font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              {card.sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{card.sub}</p>}
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Type Donut */}
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold mb-1">Property Types</h2>
            <p className="text-xs text-muted-foreground mb-4">Your listings by category</p>
            {typeData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie data={typeData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                      {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 flex-1">
                  {typeData.map((t, i) => (
                    <div key={t.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-sm flex-1">{t.name}</span>
                      <span className="text-sm font-semibold">{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">Add properties to see breakdown</div>
            )}
          </div>

          {/* City Bar Chart */}
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold mb-1">Listings by City</h2>
            <p className="text-xs text-muted-foreground mb-4">Your top performing cities</p>
            {cityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={cityData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="listings" name="Listings" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">Add properties to see city data</div>
            )}
          </div>
        </div>

        {/* Purpose Split + Inquiry Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Purpose Donut */}
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold mb-1">Sale vs Rent</h2>
            <p className="text-xs text-muted-foreground mb-4">Listing purpose split</p>
            {purposeData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={purposeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                      <Cell fill="#3b82f6" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-6 mt-2">
                  {purposeData.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? "#3b82f6" : "#f59e0b" }} />
                      <span className="text-xs text-muted-foreground">{p.name}</span>
                      <span className="text-xs font-semibold">{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
            )}
          </div>

          {/* Inquiry Performance */}
          <div className="glass-card p-6 lg:col-span-2">
            <h2 className="font-heading font-semibold mb-1">Inquiry Overview</h2>
            <p className="text-xs text-muted-foreground mb-4">Response performance</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-lg bg-amber-500/10 p-4 text-center">
                <p className="text-2xl font-heading font-bold text-amber-400">{pendingInquiries.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Pending</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-4 text-center">
                <p className="text-2xl font-heading font-bold text-emerald-400">{respondedInquiries.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Responded</p>
              </div>
            </div>
            <div className="rounded-lg bg-muted/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Response Rate</span>
                <span className="text-xs font-semibold">{inquiries.length > 0 ? Math.round((respondedInquiries.length / inquiries.length) * 100) : 0}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${inquiries.length > 0 ? (respondedInquiries.length / inquiries.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Listings */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold">Recent Listings</h2>
              <Link to="/agent-dashboard/listings" className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowUpRight className="h-3 w-3" /></Link>
            </div>
            <div className="space-y-3">
              {myListings.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No listings yet</p>
                  <Link to="/agent-dashboard/add-property" className="text-xs text-primary hover:underline">Add your first property</Link>
                </div>
              ) :
                myListings.slice(0, 5).map(p => (
                  <Link key={p._id} to={`/property/${p._id}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <img src={getImageUrl(p.images?.[0])} alt={p.title} className="w-12 h-12 rounded-lg object-cover shrink-0" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.location} • {formatPrice(p.price)}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${p.isApproved ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {p.isApproved ? "Active" : "Pending"}
                    </span>
                  </Link>
                ))
              }
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold">Recent Inquiries</h2>
              <Link to="/agent-dashboard/inquiries" className="text-xs text-primary hover:underline flex items-center gap-1">View All <ArrowUpRight className="h-3 w-3" /></Link>
            </div>
            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No inquiries yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Inquiries will appear here when buyers contact you</p>
                </div>
              ) :
                inquiries.slice(0, 5).map(inq => {
                  const u = typeof inq.user === "object" ? inq.user : null;
                  const prop = typeof inq.property === "object" ? inq.property : null;
                  return (
                    <div key={inq._id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {u?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{u?.name || "Unknown"}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${inq.status === "responded" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                            {inq.status === "responded" ? "Replied" : "New"}
                          </span>
                        </div>
                        <p className="text-xs text-primary truncate">{prop?.title || "Property"}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{inq.message}</p>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
