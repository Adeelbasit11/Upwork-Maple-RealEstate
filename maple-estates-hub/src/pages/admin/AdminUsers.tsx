import { useState, useEffect } from "react";
import { Search, Trash2, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { adminAPI } from "@/lib/api";
import { User } from "@/types";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers()
      .then(res => setUsers(res.data.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try { await adminAPI.deleteUser(id); setUsers(prev => prev.filter(u => u._id !== id)); } catch {}
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-heading font-bold mb-6">Users</h1>

      <div className="glass-card p-4 mb-6">
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1" />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">User</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Email</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Role</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Joined</th>
                <th className="text-right p-4 text-xs text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{u.name[0]?.toUpperCase()}</div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4 capitalize">{u.role}</td>
                  <td className="p-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleDelete(u._id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
