import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart3, 
  Users, 
  UserCheck, 
  BookOpen, 
  Video, 
  FolderOpen, 
  Megaphone, 
  UserCircle, 
  LogOut,
  GraduationCap,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FacultyLayout = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("faculty_bypass");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/faculty", icon: BarChart3, end: true },
    { name: "Students", path: "/faculty/students", icon: Users },
    { name: "Attendance", path: "/faculty/attendance", icon: UserCheck },
    { name: "Homework", path: "/faculty/homework", icon: BookOpen },
    { name: "Lectures", path: "/faculty/lectures", icon: Video },
    { name: "Materials", path: "/faculty/materials", icon: FolderOpen },
    { name: "Notices", path: "/faculty/notices", icon: Megaphone },
    { name: "Profile", path: "/faculty/profile", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col md:flex-row font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-[#0F172A] text-white flex-col fixed h-full shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-white/5 bg-[#1E293B]/30">
          <div className="bg-primary p-1.5 rounded text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-none">Shree Classes</span>
            <span className="text-[10px] text-gray-400 mt-1.5 uppercase font-semibold tracking-wider">Faculty Portal</span>
          </div>
        </div>
        
        <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all group",
                isActive ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-red-500/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 items-center justify-between px-8 hidden md:flex sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-medium">Session: 2024-25</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-8 w-[1px] bg-gray-100 mx-2" />
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 leading-none">{profile?.full_name || "Faculty Member"}</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">Verified Staff</p>
            </div>
          </div>
        </header>

        {/* Mobile Nav */}
        <header className="md:hidden bg-[#0F172A] text-white p-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-bold">Shree Classes</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <aside className="w-64 bg-[#0F172A] h-full p-4 space-y-2" onClick={e => e.stopPropagation()}>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded text-sm font-medium",
                    isActive ? "bg-primary text-white" : "text-gray-400"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-500")} />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </aside>
          </div>
        )}

        <div className="p-4 md:p-8 flex-1 animate-in fade-in duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FacultyLayout;
