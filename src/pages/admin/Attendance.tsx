import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar as CalIcon, UserCheck, UserX } from "lucide-react";

interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;
  subject: string;
  status: string;
  profiles?: { full_name: string; standard: string };
}

const AttendanceOverview = () => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: "", standard: "", subject: "" });

  const fetchAll = async () => {
    setLoading(true);
    // Fetch and join with profiles table
    let query = supabase.from("attendance").select(`
      *,
      profiles (full_name, standard)
    `).order("date", { ascending: false });

    if (filters.date) query = query.eq("date", filters.date);
    
    const { data: records } = await query;
    setData((records as any[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [filters.date]);

  const filtered = data.filter(r => {
    const stdMatch = !filters.standard || r.profiles?.standard?.toLowerCase().includes(filters.standard.toLowerCase());
    const subMatch = !filters.subject || r.subject?.toLowerCase().includes(filters.subject.toLowerCase());
    return stdMatch && subMatch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#1B2B4E] tracking-tight">Attendance Audit</h2>
          <p className="text-gray-500 font-medium mt-1">Cross-institutional monitoring of student presence and schedules.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date Filter</span>
            <div className="relative">
              <CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input type="date" className="pl-10 h-10 border-gray-100 bg-gray-50/50" value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Class/Standard</span>
            <Input placeholder="e.g. 10th" className="h-10 border-gray-100 bg-gray-50/50" value={filters.standard} onChange={e => setFilters({...filters, standard: e.target.value})} />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</span>
            <Input placeholder="Search subject..." className="h-10 border-gray-100 bg-gray-50/50" value={filters.subject} onChange={e => setFilters({...filters, subject: e.target.value})} />
          </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden bg-white">
         <CardContent className="p-0">
           <Table>
             <TableHeader className="bg-gray-50/50">
               <TableRow className="border-gray-100">
                 <TableHead className="py-5 pl-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Student Name</TableHead>
                 <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Class</TableHead>
                 <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Subject</TableHead>
                 <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Date</TableHead>
                 <TableHead className="py-5 pr-8 font-black text-[10px] uppercase tracking-widest text-gray-400 text-right">Status</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {loading ? (
                 <TableRow><TableCell colSpan={5} className="py-24 text-center text-gray-300 italic">Querying records...</TableCell></TableRow>
               ) : filtered.length === 0 ? (
                 <TableRow><TableCell colSpan={5} className="py-32 text-center text-gray-300 font-bold uppercase tracking-widest opacity-20">No matching logs</TableCell></TableRow>
               ) : (
                 filtered.map((r) => (
                   <TableRow key={r.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="py-5 pl-8 font-bold text-gray-900 leading-tight">
                        {r.profiles?.full_name || "Unknown Student"}
                      </TableCell>
                      <TableCell className="py-5 text-center text-xs font-black text-gray-400 uppercase tracking-widest">
                         {r.profiles?.standard || "N/A"}
                      </TableCell>
                      <TableCell className="py-5 text-center font-bold text-blue-600/60 uppercase text-[10px]">
                         {r.subject}
                      </TableCell>
                      <TableCell className="py-5 text-center text-sm font-medium text-gray-500">
                         {new Date(r.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-5 pr-8 text-right">
                         <Badge 
                           className={r.status === 'Present' 
                             ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100' 
                             : 'bg-red-50 text-red-600 hover:bg-red-50 border-red-100'
                           }
                         >
                           {r.status === 'Present' ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                           {r.status.toUpperCase()}
                         </Badge>
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

export default AttendanceOverview;
