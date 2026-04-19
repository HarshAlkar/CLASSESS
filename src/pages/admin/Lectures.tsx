import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Video, Calendar, Link as LinkIcon, User } from "lucide-react";

interface LectureLog {
  id: string;
  subject: string;
  topic: string;
  date: string;
  video_url: string;
  standard: string;
  faculty_id: string;
}

const LecturesOverview = () => {
  const [data, setData] = useState<LectureLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: records } = await supabase.from("lectures").select("*").order("date", { ascending: false });
      setData((records as LectureLog[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-black text-[#1B2B4E] tracking-tight">Lecture session Archive</h2>
        <p className="text-gray-500 font-medium mt-1">Institutional record of all recorded and scheduled lecture sessions.</p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
               <TableRow className="border-gray-50">
                  <TableHead className="py-5 pl-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Class Session Topic</TableHead>
                  <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Subject</TableHead>
                  <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Class</TableHead>
                  <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Execution Date</TableHead>
                  <TableHead className="py-5 pr-8 font-black text-[10px] uppercase tracking-widest text-gray-400 text-right">Reference</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="py-24 text-center text-gray-300 italic">Retriving session logs...</TableCell></TableRow>
              ) : data.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-32 text-center text-gray-300 font-black uppercase tracking-widest opacity-20">Archive Empty</TableCell></TableRow>
              ) : (
                data.map((l) => (
                  <TableRow key={l.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="py-6 pl-8">
                       <div className="flex flex-col">
                          <span className="font-bold text-[#1B2B4E] text-sm uppercase tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{l.topic}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2.5 py-1 rounded shadow-inner uppercase tracking-widest">{l.subject}</span>
                    </TableCell>
                    <TableCell className="text-center font-black text-gray-400 text-xs">CLASS {l.standard}</TableCell>
                    <TableCell className="text-center text-xs font-bold text-gray-500 uppercase">
                       <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-3 w-3 text-emerald-500" /> {new Date(l.date).toLocaleDateString()}
                       </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                       {l.video_url ? (
                         <a href={l.video_url} target="_blank" className="text-[10px] font-black text-blue-600 hover:underline uppercase flex items-center justify-end gap-1.5 tracking-widest">
                           URL <LinkIcon className="h-3 w-3" />
                         </a>
                       ) : (
                         <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">NO LINK</span>
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

export default LecturesOverview;
