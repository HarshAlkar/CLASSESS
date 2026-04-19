import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  ClipboardList, 
  Video, 
  FileText, 
  Bell, 
  UserCircle, 
  LogOut,
  GraduationCap,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const StudentLayout = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const navItems = [
    { name: "My Dashboard", path: "/student", icon: LayoutDashboard, end: true },
    { name: "My Attendance", path: "/student/attendance", icon: CalendarCheck },
    { name: "My Homework", path: "/student/homework", icon: ClipboardList },
    { name: "Lecture Library", path: "/student/lectures", icon: Video },
    { name: "Study Materials", path: "/student/materials", icon: FileText },
    { name: "Notices & Alerts", path: "/student/notices", icon: Bell },
    { name: "My Profile", path: "/student/profile", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col md:flex-row text-slate-800">
      {/* Primary Sidebar - Solid Construction */}
      <aside className="hidden md:flex w-60 bg-[#0F172A] text-white flex-col fixed h-full border-r border-slate-800">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-[#1E293B]">
          <div className="bg-white p-1 rounded-sm text-[#0F172A]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm uppercase tracking-tight">Student Portal</span>
        </div>
        
        <nav className="flex-1 mt-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors",
                isActive ? "bg-slate-800 text-white border-l-4 border-white" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#1E293B]">
          <button 
            className="flex items-center gap-3 px-2 py-2 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest w-full transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Simple Utility Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shree Classes &centerdot; ERP v1.0</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right pr-4 border-r border-slate-100">
              <p className="text-xs font-bold text-slate-900 leading-none">{profile?.full_name}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">{profile?.standard} - {profile?.medium}</p>
            </div>
            <div className="h-8 w-8 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
              {profile?.full_name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="p-6 md:p-10 flex-1">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>

        {/* Practical Footer */}
        <footer className="p-4 border-t border-slate-200 bg-white text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center md:text-left md:px-10">
          Student ID: {profile?.id?.slice(0, 8)} | Class: {profile?.standard || "NOT ASSIGNED"} | Secured Access Only
        </footer>
      </main>
    </div>
  );
};

export default StudentLayout;
