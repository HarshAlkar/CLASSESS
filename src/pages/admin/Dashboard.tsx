import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, UserCheck, MessageSquare, Megaphone, 
  ShieldCheck, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    pending: 0,
    enquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: students } = await supabase.from("profiles").select("id", { count: "exact" }).eq("requested_role", "student");
      const { data: faculty } = await supabase.from("profiles").select("id", { count: "exact" }).eq("requested_role", "faculty");
      const { data: pending } = await supabase.from("profiles").select("id", { count: "exact" }).eq("status", "pending");
      const { data: enquiries } = await supabase.from("enquiries").select("id", { count: "exact" });

      setStats({
        students: students?.length || 0,
        faculty: faculty?.length || 0,
        pending: pending?.length || 0,
        enquiries: enquiries?.length || 0
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Students Registered", value: stats.students, icon: Users, color: "bg-blue-600" },
    { label: "Active Faculty Members", value: stats.faculty, icon: ShieldCheck, color: "bg-emerald-600" },
    { label: "Pending Account Requests", value: stats.pending, icon: UserCheck, color: "bg-red-600" },
    { label: "New Admission Enquiries", value: stats.enquiries, icon: MessageSquare, color: "bg-slate-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Management Summary</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Quick overview of institute data and pending administrative tasks.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border border-slate-200 rounded-sm shadow-none bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-4">
                   <div className={`${stat.color} text-white p-2`}>
                      <stat.icon className="h-4 w-4" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400">COUNTER</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 leading-none">{loading ? "--" : stat.value}</h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">{stat.label}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         {/* Pending Actions */}
         <div className="bg-white border border-slate-200 rounded-sm">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
               <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">User Approval Monitor</h2>
               <div className="h-2 w-2 bg-red-500 rounded-full" />
            </div>
            <div className="p-6">
               {stats.pending === 0 ? (
                 <p className="text-sm text-slate-400 italic">No pending profile approvals required.</p>
               ) : (
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold text-slate-800">{stats.pending} Users Awaiting Review</p>
                       <p className="text-xs text-slate-500 mt-1">Review student and faculty registrations.</p>
                    </div>
                    <Link to="/admin/approvals" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                       GO TO APPROVALS <ArrowRight className="h-3 w-3" />
                    </Link>
                 </div>
               )}
            </div>
         </div>

         {/* Announcement Quick View */}
         <div className="bg-white border border-slate-200 rounded-sm">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
               <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Communication Status</h2>
               <Megaphone className="h-3 w-3 text-slate-400" />
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                       <p className="text-sm font-bold text-slate-800">Latest Announcements</p>
                       <p className="text-xs text-slate-500 mt-1">Check recent updates sent to students.</p>
                    </div>
                    <Link to="/admin/announcements" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                       MANAGE HUB <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </div>
         </div>
      </div>
      
      {/* Footer Info Box */}
      <div className="bg-slate-100 p-4 border border-slate-200 rounded-sm text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em] flex justify-between">
         <span>Build Version: 1.0.4 - STABLE</span>
         <span>System Last Sync: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
