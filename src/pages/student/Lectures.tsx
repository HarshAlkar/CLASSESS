import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Play } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

interface Lecture {
  id: string;
  subject: string;
  topic: string;
  date: string;
  video_url: string;
  standard: string;
}

const Lectures = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLectures = async () => {
    setLoading(true);
    // REMOVED FILTER: Fetching all lectures for immediate visibility
    const { data: records, error } = await supabase
      .from("lectures")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) console.error("Lec Fetch Error:", error);
    setData((records as Lecture[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLectures();
    const channel = supabase.channel('lec_sync').on('postgres_changes', { event: '*', schema: 'public', table: 'lectures' }, () => fetchLectures()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1B2B4E]">Video Lectures</h2>
        <p className="text-sm text-gray-500 mt-1">Watch recorded sessions for your classes.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading lectures...</div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <Video className="h-10 w-10 text-gray-200 mb-3" />
          <p className="text-gray-400 font-medium">No recorded lectures available.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((l) => (
            <Card key={l.id} className="border-none shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-all group bg-white overflow-hidden">
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/20 transition-all">
                  <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100" />
                </div>
                <div className="absolute top-3 left-3">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-primary px-2 py-0.5 rounded shadow-sm">
                    {l.subject}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h4 className="font-bold text-[#1B2B4E] leading-tight line-clamp-2 min-h-[2.5rem]">{l.topic}</h4>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 font-medium pb-4 border-b border-gray-50">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(l.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <Button className="w-full mt-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-none font-semibold text-xs" asChild>
                  <a href={l.video_url} target="_blank" rel="noopener noreferrer">
                    <Play className="h-3 w-3 mr-2 text-primary" /> WATCH RECORDING
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lectures;
