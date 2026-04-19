import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type AppRole = "admin" | "faculty" | "student";

const RequireRole = ({ role, children }: { role: AppRole; children: React.ReactNode }) => {
  const { user, roles, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Loading…</div>
    );
  }

  // Check for admin bypass
  if (localStorage.getItem("admin_bypass") === "true") {
    return <>{children}</>;
  }

  // Check for faculty bypass
  if (localStorage.getItem("faculty_bypass") === "true") {
    return <>{children}</>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (profile && profile.status !== "approved") {
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes(role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default RequireRole;
