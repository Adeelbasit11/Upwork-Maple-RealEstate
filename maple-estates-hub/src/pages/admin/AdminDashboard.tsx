import { useState, useEffect } from "react";
import { Building, Users, TrendingUp, MessageSquare, Loader2, ShieldCheck, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from "recharts";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { adminAPI } from "@/lib/api";
import { formatPrice } from "@/components/PropertyCard";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setData(res.data.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  const s = data?.stats || {};
  const charts = data?.charts || {};
  const recent = data?.recentActivity || {};

  const statCards = [
    { label: "Total Properties", value: s.totalProperties ?? 0, icon: Building, color: "text-blue-400", bg: "bg-blue-500/10", trend: s.approvedProperties ? `${s.approvedProperties} approved` : null },
    { label: "Pending Properties", value: s.pendingProperties ?? 0, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", trend: "awaiting review" },
    { label: "Total Users", value: s.totalUsers ?? 0, icon: Users, color: "text-green-400", bg: "bg-green-500/10", trend: null },
    { label: "Total Agents", value: s.totalAgents ?? 0, icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-500/10", trend: `${s.pendingAgents ?? 0} pending` },
    { label: "Inquiries", value: s.totalInquiries ?? 0, icon: MessageSquare, color: "text-cyan-400", bg: "bg-cyan-500/10", trend: `${s.pendingInquiries ?? 0} pending` },
    { label: "Approved Properties", value: s.approvedProperties ?? 0, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", trend: null },
  ];

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

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your real estate platform</p>
        </div>
        <Link to="/admin/approvals" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Review Approvals <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="glass-card p-5 hover:border-border transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              {card.trend && <span className="text-xs text-muted-foreground">{card.trend}</span>}
            </div>
            <p className="text-3xl font-heading font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Activity Area Chart */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold mb-1">Monthly Activity</h2>
          <p className="text-xs text-muted-foreground mb-4">Users & properties over the last 6 months</p>
          {charts.monthlyData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={charts.monthlyData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
                <Area type="monotone" dataKey="users" name="Users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                <Area type="monotone" dataKey="properties" name="Properties" stroke="#22c55e" fillOpacity={1} fill="url(#colorProps)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No monthly data yet</div>
          )}
        </div>

        {/* Property Types Pie Chart */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold mb-1">Property Types</h2>
          <p className="text-xs text-muted-foreground mb-4">Distribution by category</p>
          {charts.propertyTypes?.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={260}>
                <PieChart>
                  <Pie data={charts.propertyTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                    {charts.propertyTypes.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {charts.propertyTypes.map((t: any, i: number) => (
                  <div key={t.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm flex-1">{t.name}</span>
                    <span className="text-sm font-semibold">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No property data yet</div>
          )}
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* City Distribution Bar Chart */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold mb-1">Top Cities</h2>
          <p className="text-xs text-muted-foreground mb-4">Properties by city</p>
          {charts.cityDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.cityDistribution} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="properties" name="Properties" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No city data yet</div>
          )}
        </div>

        {/* Purpose Split + Quick Stats */}
        <div className="glass-card p-6">
          <h2 className="font-heading font-semibold mb-1">Listing Purpose</h2>
          <p className="text-xs text-muted-foreground mb-4">Sale vs Rent breakdown</p>
          {charts.propertyPurpose?.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={260}>
                <PieChart>
                  <Pie data={charts.propertyPurpose} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4 flex-1">
                {charts.propertyPurpose.map((p: any, i: number) => (
                  <div key={p.name} className="glass-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: i === 0 ? "#3b82f6" : "#f59e0b" }} />
                      <span className="text-xs text-muted-foreground">{p.name}</span>
                    </div>
                    <p className="text-xl font-heading font-bold">{p.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold">Recent Properties</h2>
            <Link to="/admin/properties" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          {(recent.recentProperties?.length > 0) ? (
            <div className="space-y-3">
              {recent.recentProperties.map((p: any) => (
                <div key={p._id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Building className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.location} • {formatPrice(p.price)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.isApproved ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {p.isApproved ? "Active" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">No properties yet.</p>}
        </div>

        {/* Recent Users */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold">Recent Users</h2>
            <Link to="/admin/users" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          {(recent.recentUsers?.length > 0) ? (
            <div className="space-y-3">
              {recent.recentUsers.map((u: any) => (
                <div key={u._id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${u.role === "admin" ? "bg-red-500/10 text-red-400" : u.role === "agent" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">No users yet.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
