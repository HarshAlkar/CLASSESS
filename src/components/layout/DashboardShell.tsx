import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const DashboardShell = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <header className="bg-background border-b border-border">
        <div className="container-tight flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold text-primary">Shree Classes</div>
              <div className="text-xs text-muted-foreground">{title}</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground">{profile?.full_name}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardShell;
