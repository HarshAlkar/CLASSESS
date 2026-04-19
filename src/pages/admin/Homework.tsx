import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, BookOpen, Calendar, ShieldCheck } from "lucide-react";

interface HomeworkLog {
  id: string;
  subject: string;
  title: string;
  standard: string;
  due_date: string;
  created_at: string;
}

const HomeworkOverview = () => {
  const [data, setData] = useState<HomeworkLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: records } = await supabase.from("homework").select("*").order("created_at", { ascending: false });
      setData((records as HomeworkLog[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-black text-[#1B2B4E] tracking-tight">Homework Assignments</h2>
        <p className="text-gray-500 font-medium mt-1">Reviewing all academic tasks assigned by faculty members.</p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50 text-gray-400">
               <TableRow className="border-gray-50">
                  <TableHead className="py-5 pl-8 font-black text-[10px] uppercase tracking-widest">Assignment Detail</TableHead>
                  <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-center">Subject</TableHead>
                  <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-center">Standard</TableHead>
                  <TableHead className="py-5 pr-8 font-black text-[10px] uppercase tracking-widest text-right">Submission Deadline</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="py-20 text-center text-gray-300 italic">Processing logs...</TableCell></TableRow>
              ) : data.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="py-32 text-center text-gray-300 font-black uppercase tracking-widest opacity-20">No data found</TableCell></TableRow>
              ) : (
                data.map((h) => (
                  <TableRow key={h.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="py-6 pl-8">
                       <div className="flex flex-col">
                          <span className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{h.title}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase mt-1">Published: {new Date(h.created_at).toLocaleDateString()}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{h.subject}</span>
                    </TableCell>
                    <TableCell className="text-center font-black text-gray-400 text-xs">CLASS {h.standard}</TableCell>
                    <TableCell className="pr-8 text-right">
                       <span className="flex items-center justify-end gap-2 text-xs font-bold text-amber-600">
                          <Calendar className="h-3 w-3" /> {h.due_date}
                       </span>
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

export default HomeworkOverview;
