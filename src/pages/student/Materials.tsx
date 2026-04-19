import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen, ExternalLink, Play, Cloud } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Material {
  id: string;
  subject: string;
  title: string;
  file_url: string;
  created_at: string;
}

const Materials = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    // REMOVED FILTER: Show all materials to ensure teacher data is visible
    const { data: records, error } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) console.error("Mat Fetch Error:", error);
    setData((records as Material[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    const ch = supabase.channel('mat_s').on('postgres_changes',{event:'*',schema:'public',table:'materials'},()=>fetchItems()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [profile]);

  const getLinkMeta = (url: string) => {
    const u = url.toLowerCase();
    if (u.includes("youtube.com") || u.includes("youtu.be")) return { label: "WATCH VIDEO", icon: Play, color: "text-red-600 bg-red-50 border-red-100" };
    if (u.includes("drive.google.com")) return { label: "OPEN DRIVE", icon: Cloud, color: "text-blue-600 bg-blue-50 border-blue-100" };
    if (u.endsWith(".pdf") || u.includes("/pdf")) return { label: "DOWNLOAD PDF", icon: Download, color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    return { label: "VISIT LINK", icon: ExternalLink, color: "text-indigo-600 bg-indigo-50 border-indigo-100" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#1B2B4E]">Study Materials</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Resources shared specifically for your class.</p>
        </div>
        <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-[#1B2B4E]">
          <BookOpen className="h-5 w-5" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 italic font-medium">Syncing materials...</div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-100">
          <BookOpen className="h-12 w-12 text-gray-200 mb-4 opacity-50" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-sm opacity-30">No materials shared yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 pb-10">
          {data.map((m) => {
            const meta = getLinkMeta(m.file_url);
            return (
              <Card key={m.id} className="border-none shadow-sm ring-1 ring-gray-100 hover:ring-blue-100 transition-all bg-white overflow-hidden group">
                <CardContent className="p-0">
                  <div className="h-1 w-full bg-gray-50 group-hover:bg-blue-500 transition-all" />
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 shadow-inner rotate-3 group-hover:rotate-0 transition-all">
                        <FileText className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 bg-blue-50 px-2.5 py-1 rounded shadow-inner">
                            {m.subject}
                          </span>
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                            <Calendar className="h-3.5 w-3.5" /> {new Date(m.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-[#1B2B4E] tracking-tight group-hover:text-blue-700 transition-all">{m.title}</h4>
                      </div>
                    </div>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className={cn(
                        "rounded-xl font-black text-[10px] tracking-widest px-6 h-12 shadow-sm border-transparent transition-all",
                        meta.color
                      )} 
                      asChild
                    >
                      <a href={m.file_url.startsWith('http') ? m.file_url : `https://${m.file_url}`} target="_blank" rel="noopener noreferrer">
                        <meta.icon className="h-4 w-4 mr-2.5" /> {meta.label}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

import { Calendar } from "lucide-react";

export default Materials;
