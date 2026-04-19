import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, CalendarDays } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  status: 'Present' | 'Absent';
}

const Attendance = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    if (!profile) return;
    setLoading(true);
    // Fetch ALL attendance for now so we can verify connectivity
    const { data: records } = await supabase
      .from("attendance")
      .select("*")
      .order("date", { ascending: false });
    
    setData((records as AttendanceRecord[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();

    // REAL-TIME SUBSCRIPTION
    const channel = supabase
      .channel('attendance_sync')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'attendance',
        filter: `user_id=eq.${profile?.id}`
      }, () => {
        fetchRecords();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const presentCount = data.filter(r => r.status === 'Present').length;
  const percentage = data.length > 0 ? Math.round((presentCount / data.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1B2B4E]">Attendance Record</h2>
        <p className="text-sm text-gray-500 mt-1">Keep track of your presence in class.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 shadow-sm border-none ring-1 ring-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Overall Attendance</p>
                <h3 className="text-3xl font-bold text-[#1B2B4E] mt-1">{percentage}%</h3>
                <div className="mt-4 flex items-center gap-4">
                  <Progress value={percentage} className="h-2 flex-1" />
                  <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">{presentCount} / {data.length} Days</span>
                </div>
              </div>
              <div className="hidden sm:flex h-16 w-16 bg-blue-50 text-blue-600 rounded-full items-center justify-center">
                <CalendarDays className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <CardHeader className="bg-white border-b border-gray-100 py-4">
          <CardTitle className="text-base font-semibold">Activity History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-gray-100">
                <TableHead className="w-[150px] font-semibold text-gray-600">Date</TableHead>
                <TableHead className="font-semibold text-gray-600">Subject</TableHead>
                <TableHead className="w-[120px] font-semibold text-gray-600">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center py-10 text-gray-400">Loading history...</TableCell></TableRow>
              ) : data.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-10 text-gray-400">No attendance records found.</TableCell></TableRow>
              ) : (
                data.map((r) => (
                  <TableRow key={r.id} className="border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <TableCell className="text-sm text-gray-700 font-medium">
                      {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 font-medium">{r.subject}</TableCell>
                    <TableCell>
                      {r.status === 'Present' ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 font-medium px-2.5 py-0.5 rounded-full flex items-center w-fit gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Present
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-100 font-medium px-2.5 py-0.5 rounded-full flex items-center w-fit gap-1">
                          <XCircle className="h-3 w-3" /> Absent
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
