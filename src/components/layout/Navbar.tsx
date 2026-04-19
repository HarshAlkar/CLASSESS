import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
  { to: "/announcements", label: "Announcements" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, roles, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = roles.includes("admin")
    ? "/admin"
    : roles.includes("faculty")
    ? "/faculty"
    : roles.includes("student")
    ? "/student"
    : "/login";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-primary">Shree Classes</div>
            <div className="text-xs text-muted-foreground">Kalyan West</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user && profile?.status === "approved" ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to={dashboardPath}>Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-tight flex flex-col py-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className="px-3 py-2 text-sm font-medium text-foreground/80"
                activeClassName="text-primary"
              >
                <span onClick={() => setOpen(false)}>{l.label}</span>
              </NavLink>
            ))}
            <div className="my-2 h-px bg-border" />
            {user && profile?.status === "approved" ? (
              <>
                <Link to={dashboardPath} onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-primary">
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="px-3 py-2 text-left text-sm font-medium text-foreground/80">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-primary">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
