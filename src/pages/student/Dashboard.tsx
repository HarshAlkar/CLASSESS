import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  ClipboardList, 
  Bell, 
  ArrowRight,
  Calendar,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Announcement { id: string; title: string; description: string; created_at: string }

const Dashboard = () => {
  const { profile } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState({ attendance: 0, pendingHomework: 0 });

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      if (!profile) return;
      
      const { data: att } = await supabase.from("attendance").select("status").eq("user_id", profile.id);
      const { data: hw } = await supabase.from("homework").select("status").eq("user_id", profile.id).eq("status", "Pending");

      if (att) {
        const present = att.filter(a => a.status === 'Present').length;
        setStats(prev => ({ ...prev, attendance: att.length > 0 ? Math.round((present / att.length) * 100) : 0 }));
      }
      if (hw) setStats(prev => ({ ...prev, pendingHomework: hw.length }));
    };

    const fetchAnnouncements = async () => {
      const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(3);
      setAnnouncements((data as Announcement[]) ?? []);
    };

    fetchStats();
    fetchAnnouncements();
  }, [profile]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1B2B4E]">Welcome, {profile?.full_name}</h2>
          <p className="text-sm text-gray-500 mt-1">Here is a quick overview of your academic progress.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#1B2B4E]" />
          <span className="text-sm font-medium text-gray-600">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          title="Attendance" 
          value={`${stats.attendance}%`} 
          subtitle="Monthly average" 
          icon={<Users className="h-5 w-5" />} 
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="Pending Homework" 
          value={stats.pendingHomework.toString()} 
          subtitle="Assignments to complete" 
          icon={<ClipboardList className="h-5 w-5" />} 
          color="bg-amber-50 text-amber-600"
        />
        <StatCard 
          title="Latest Notice" 
          value={announcements.length > 0 ? "1 New" : "0"} 
          subtitle={announcements[0]?.title ?? "No new notices"} 
          icon={<Bell className="h-5 w-5" />} 
          color="bg-red-50 text-red-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm ring-1 ring-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold">Recent Announcements</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-[#1B2B4E]">
              <Link to="/student/notices">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {announcements.length === 0 ? (
              <EmptyState message="No notices released yet" />
            ) : (
              <div className="space-y-4">
                {announcements.map((a) => (
                  <div key={a.id} className="p-4 rounded-lg bg-gray-50/50 border border-gray-100 flex gap-4 transition-hover hover:bg-white hover:shadow-md cursor-pointer group">
                    <div className="bg-white h-10 w-10 shrink-0 rounded border border-gray-100 flex items-center justify-center text-[#1B2B4E] shadow-sm">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        {new Date(a.created_at).toLocaleDateString('en-IN')}
                      </p>
                      <h4 className="font-semibold text-sm text-[#1B2B4E] group-hover:text-primary transition-colors">{a.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold">Academic Quick Link</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickLink to="/student/lectures" title="Access Lectures" desc="Watch recorded or live sessions" />
            <QuickLink to="/student/materials" title="Study Materials" desc="Notes, PDFs and guides for subjects" />
            <QuickLink to="/student/profile" title="My Profile" desc="Manage your personal information" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color }: any) => (
  <Card className="border-none shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-[#1B2B4E] mt-1">{value}</h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{subtitle}</p>
        </div>
        <div className={cn("p-2 rounded-lg", color)}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickLink = ({ to, title, desc }: any) => (
  <Link to={to} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50 transition-all group">
    <div>
      <h4 className="text-sm font-semibold text-[#1B2B4E]">{title}</h4>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#1B2B4E] group-hover:translate-x-1 transition-all" />
  </Link>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-10">
    <div className="bg-gray-50 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
      <Users className="h-6 w-6 text-gray-300" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default Dashboard;
