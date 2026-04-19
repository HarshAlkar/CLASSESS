import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Video, Bell, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    homeworkCount: 0,
    todayLectures: 0,
    announcements: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [students, homework, lectures, notices] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }).eq("requested_role", "student"),
        supabase.from("homework").select("id", { count: "exact" }).eq("status", "Pending"),
        supabase.from("lectures").select("id", { count: "exact" }).eq("date", new Date().toISOString().split('T')[0]),
        supabase.from("announcements").select("id", { count: "exact" }),
      ]);

      setStats({
        totalStudents: students.count || 0,
        homeworkCount: homework.count || 0,
        todayLectures: lectures.count || 0,
        announcements: notices.count || 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Faculty Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your students and academic content from here.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users />} color="bg-blue-50 text-blue-600" />
        <StatCard title="Pending Homework" value={stats.homeworkCount} icon={<BookOpen />} color="bg-amber-50 text-amber-600" />
        <StatCard title="Today's Lectures" value={stats.todayLectures} icon={<Video />} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Recent Notices" value={stats.announcements} icon={<Bell />} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-gray-100">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Faculty Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
              <GraduationCap className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Welcome, Professor {profile?.full_name || "Faculty"}</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-2">
                Use the sidebar to manage attendance, upload homework materials, or post announcements for your classes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-gray-100">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/faculty/attendance" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 group">
              Mark Attendance <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-all" />
            </Link>
            <Link to="/faculty/homework" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 group">
              Assign Homework <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-all" />
            </Link>
            <Link to="/faculty/materials" className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all font-medium text-sm text-gray-600 group">
              Upload Materials <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-all" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <Card className="border-none shadow-sm ring-1 ring-gray-100">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={cn("p-2 rounded-lg", color)}>{icon}</div>
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export default Dashboard;
