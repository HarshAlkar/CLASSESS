import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, UserCheck, ClipboardCheck, 
  BookOpen, Video, FileText, Megaphone, MessageSquare, 
  UserCircle, LogOut, Menu, X, ChevronRight, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: UserCheck, label: "Approvals", path: "/admin/approvals" },
    { icon: Users, label: "Student Directory", path: "/admin/students" },
    { icon: ShieldCheck, label: "Faculty Directory", path: "/admin/faculty" },
    { icon: ClipboardCheck, label: "Attendance Audit", path: "/admin/attendance" },
    { icon: BookOpen, label: "Homework Audit", path: "/admin/homework" },
    { icon: Video, label: "Lectures List", path: "/admin/lectures" },
    { icon: FileText, label: "Study Materials", path: "/admin/materials" },
    { icon: Megaphone, label: "Broadcast News", path: "/admin/announcements" },
    { icon: MessageSquare, label: "New Enquiries", path: "/admin/enquiries" },
    { icon: UserCircle, label: "Admin Profile", path: "/admin/profile" },
  ];

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-800">
      {/* Sidebar - Solid ERP Style */}
      <aside className={`bg-[#0F172A] text-white transition-all duration-200 ${isSidebarOpen ? 'w-64' : 'w-16'} flex flex-col border-r border-slate-700`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#1E293B]">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-white text-[#0F172A] flex items-center justify-center font-bold text-lg">S</div>
             {isSidebarOpen && (
               <div className="flex flex-col">
                 <span className="font-bold text-sm tracking-tight">SHREE CLASSES</span>
                 <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider -mt-1">Management Portal</span>
               </div>
             )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <p className={`px-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ${!isSidebarOpen && 'invisible'}`}>Main Menu</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive 
                    ? "bg-slate-800 text-white border-l-4 border-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-[#1E293B] border-t border-slate-800">
           {isSidebarOpen && (
             <div className="mb-4 px-2">
                <p className="text-xs font-bold text-white mb-0.5 truncate">{profile?.full_name || "Admin"}</p>
                <p className="text-[10px] text-slate-400 font-medium">Administrator</p>
             </div>
           )}
           <button 
             onClick={() => signOut()}
             className="flex items-center gap-3 px-2 py-2 text-slate-400 hover:text-white transition-colors w-full text-left"
           >
             <LogOut className="h-4 w-4" />
             {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-slate-100 border border-slate-200 text-slate-500"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="text-sm font-bold text-slate-600 uppercase tracking-wider">System Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
               <span className="h-2 w-2 bg-green-500" />
               <span>SERVER CONNECTED</span>
            </div>
            <span className="hidden sm:inline">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 sm:p-8">
           <div className="max-w-full">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
