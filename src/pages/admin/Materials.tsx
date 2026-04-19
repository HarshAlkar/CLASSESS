import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Calendar, ExternalLink } from "lucide-react";

interface MaterialLog {
  id: string;
  subject: string;
  title: string;
  file_url: string;
  standard: string;
  created_at: string;
}

const MaterialsOverview = () => {
  const [data, setData] = useState<MaterialLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: records } = await supabase.from("materials").select("*").order("created_at", { ascending: false });
      setData((records as MaterialLog[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h2 className="text-3xl font-black text-[#1B2B4E] tracking-tight">E-Learning Materials</h2>
        <p className="text-gray-500 font-medium mt-1">Institutional repository of all digital study notes and resources.</p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
               <TableRow className="border-gray-50">
                  <TableHead className="py-5 pl-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Resource Title</TableHead>
                  <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Subject</TableHead>
                  <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Standard</TableHead>
                  <TableHead className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 text-center">Upload Date</TableHead>
                  <TableHead className="py-5 pr-8 font-black text-[10px] uppercase tracking-widest text-gray-400 text-right">Access</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="py-24 text-center text-gray-300 italic">Sycning repository...</TableCell></TableRow>
              ) : data.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-32 text-center text-gray-300 font-black uppercase tracking-widest opacity-20">No materials uploaded</TableCell></TableRow>
              ) : (
                data.map((m) => (
                  <TableRow key={m.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="py-6 pl-8">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-[#1B2B4E] uppercase text-sm tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{m.title}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2.5 py-1 rounded shadow-inner uppercase tracking-widest">{m.subject}</span>
                    </TableCell>
                    <TableCell className="text-center font-black text-gray-400 text-xs">CLASS {m.standard}</TableCell>
                    <TableCell className="text-center text-xs font-bold text-gray-500 uppercase">
                       <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-3 w-3 text-emerald-500" /> {new Date(m.created_at).toLocaleDateString()}
                       </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                       <a 
                        href={m.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center h-9 w-9 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-gray-100 shadow-sm"
                       >
                         <ExternalLink className="h-4 w-4" />
                       </a>
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

export default MaterialsOverview;
