import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-heading text-2xl">Access Denied</h1>
        <p className="font-body text-sm text-muted-foreground">You don't have admin privileges.</p>
        <a href="/" className="text-accent text-sm font-body">Back to store</a>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
