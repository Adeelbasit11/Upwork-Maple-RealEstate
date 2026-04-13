import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
  role?: "admin" | "agent" | "user";
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Agent must be approved to access agent routes
  if (role === "agent" && !user.isApproved) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
