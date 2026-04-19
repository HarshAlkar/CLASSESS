import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const Notices = () => {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data: records } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      
      setData((records as Announcement[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-[#1B2B4E]">Institute Notices</h2>
        <p className="text-sm text-gray-500 mt-1">Important updates and information from the office.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading notices...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <Bell className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No notices published yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((n) => (
            <Card key={n.id} className="border-none shadow-sm ring-1 ring-gray-100 bg-white hover:ring-gray-200 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-[#1B2B4E]">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                       <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                        <Calendar className="h-3 w-3" /> {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-[#1B2B4E]">{n.title}</h4>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                      {n.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notices;
