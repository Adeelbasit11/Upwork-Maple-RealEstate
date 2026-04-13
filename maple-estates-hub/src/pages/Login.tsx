import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, register, user } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    const dest = user.role === "admin" ? "/admin" : user.role === "agent" ? "/agent-dashboard" : "/dashboard";
    navigate(dest, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold mb-2">{isSignup ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-sm text-muted-foreground">{isSignup ? "Sign up to get started" : "Sign in to your account"}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" required />
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary" required />
            </div>

            <button type="submit" disabled={loading} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSignup ? <><UserPlus className="h-4 w-4" /> Sign Up</> : <><LogIn className="h-4 w-4" /> Sign In</>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => { setIsSignup(!isSignup); setError(""); }} className="text-primary font-medium hover:underline">
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
