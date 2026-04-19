import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ChevronDown, ChevronUp, Send, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface HomeworkRecord {
  id: string;
  subject: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  created_at: string;
}

const StudentHomework = () => {
  const { profile } = useAuth();
  const [data, setData] = useState<HomeworkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submission, setSubmission] = useState<{ [key: string]: string }>({});

  const fetchHomework = async () => {
    setLoading(true);
    const { data: records, error } = await supabase
      .from("homework")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) console.error("HW Fetch Error:", error);
    setData((records as HomeworkRecord[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHomework();
    const ch = supabase.channel('hw_s').on('postgres_changes',{event:'*',schema:'public',table:'homework'},()=>fetchHomework()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [profile]);

  const handleSubmit = async (hwId: string) => {
    const contentText = submission[hwId];
    if (!contentText?.trim()) return toast.error("Submission content cannot be empty.");

    setLoading(true);
    const { error: subError } = await supabase.from("homework_submissions").insert({
      homework_id: hwId,
      student_id: profile?.id,
      content: contentText
    });

    if (subError) {
      toast.error("Failed to upload submission.");
    } else {
      toast.success("Assignment submitted successfully.");
      setSubmission({ ...submission, [hwId]: "" });
      setExpandedId(null);
      // Optional: Update local status if needed
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-800 uppercase">Assigned Assignments</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Complete your pending tasks and submit before the deadline.</p>
      </div>

      {loading && data.length === 0 ? (
        <div className="py-12 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">Awaiting Records...</div>
      ) : data.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-slate-200 rounded-sm flex flex-col items-center justify-center text-slate-300">
          <BookOpen className="h-10 w-10 mb-2 opacity-50" />
          <p className="text-xs font-bold uppercase tracking-widest">No homework records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((hw) => (
            <div key={hw.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden transition-all">
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-0.5">
                      <span className="text-[9px] font-bold text-blue-600 border border-blue-100 bg-blue-50 px-1.5 py-0.5 uppercase tracking-wider">{hw.subject}</span>
                      <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase">
                        <Clock className="h-2.5 w-2.5" /> Due: {new Date(hw.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">{hw.title}</h4>
                  </div>
                </div>
                <button 
                   onClick={() => setExpandedId(expandedId === hw.id ? null : hw.id)}
                   className="text-slate-400 hover:text-slate-600 transition-colors p-2"
                >
                  {expandedId === hw.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              {expandedId === hw.id && (
                <div className="p-4 pt-0 border-t border-slate-50 bg-slate-50/50">
                  <div className="py-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Instruction Details</p>
                    <div className="text-sm text-slate-600 bg-white p-4 border border-slate-100 rounded-sm whitespace-pre-wrap leading-relaxed font-sans">
                      {hw.description || "No specific instructions provided."}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-2">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Upload Completion Proof / Drive Link</p>
                     <div className="space-y-3">
                        <Textarea 
                          placeholder="Paste your link or notes here..."
                          className="bg-white border-slate-200 focus-visible:ring-0 rounded-sm text-sm"
                          value={submission[hw.id] || ""}
                          onChange={(e) => setSubmission({ ...submission, [hw.id]: e.target.value })}
                        />
                        <Button 
                          onClick={() => handleSubmit(hw.id)}
                          disabled={loading}
                          className="w-full sm:w-auto h-9 rounded-sm bg-slate-800 hover:bg-slate-900 text-xs font-bold uppercase tracking-widest"
                        >
                          <Send className="h-3 w-4 mr-2" /> {loading ? "SUBMITTING..." : "CONFIRM SUBMISSION"}
                        </Button>
                     </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-slate-100 p-3 border border-slate-200 text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">
         Security Protocol Enabled | Homework Management v4.2
      </div>
    </div>
  );
};

export default StudentHomework;
