import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, BookOpen, Trash2, Calendar, Eye, Users, ExternalLink, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Homework {
  id: string;
  subject: string;
  title: string;
  due_date: string;
  status: string;
  standard: string;
}

interface Submission {
  id: string;
  content: string;
  submitted_at: string;
  student_id: string;
  profiles: { full_name: string };
}

const Homework = () => {
  const { profile } = useAuth();
  const [items, setItems] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
  const [expandedHw, setExpandedHw] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ subject: "", title: "", due_date: "", description: "", standard: "" });

  const fetchItems = async () => {
    const { data } = await supabase.from("homework").select("*").order("due_date", { ascending: false });
    setItems((data as Homework[]) ?? []);
  };

  const fetchSubmissions = async (hwId: string) => {
    const { data } = await supabase
      .from("homework_submissions")
      .select(`*, profiles:student_id (full_name)`)
      .eq("homework_id", hwId);
    
    setSubmissions(prev => ({ ...prev, [hwId]: (data as any[]) ?? [] }));
  };

  useEffect(() => { 
    fetchItems(); 
    const channel = supabase.channel('hw_fac').on('postgres_changes', { event: '*', schema: 'public', table: 'homework' }, () => fetchItems()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const toggleSubmissions = (hwId: string) => {
    if (expandedHw === hwId) {
      setExpandedHw(null);
    } else {
      setExpandedHw(hwId);
      fetchSubmissions(hwId);
    }
  };

  const handleAdd = async () => {
    if (!form.subject || !form.title || !form.standard) return toast.error("Fill mandatory fields (Subject, Title, Standard)");
    setLoading(true);
    const { error } = await supabase.from("homework").insert([{ ...form, faculty_id: profile?.id }]);
    if (error) toast.error(error.message);
    else {
      toast.success("Homework published!");
      setShowAdd(false);
      setForm({ subject: "", title: "", due_date: "", description: "", standard: "" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("homework").delete().eq("id", id);
    if (!error) fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Homework Management</h2>
          <p className="text-sm text-gray-500 mt-1">Assign and monitor student tasks.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "outline" : "default"}>
          {showAdd ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> Add Homework</>}
        </Button>
      </div>

      {showAdd && (
        <Card className="border-primary/20 shadow-md ring-1 ring-primary/5">
          <CardHeader>
            <CardTitle className="text-base font-bold">New Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-400">Subject</Label>
                <Input placeholder="e.g. Physics" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-400">Standard</Label>
                <Input placeholder="e.g. 10th" value={form.standard} onChange={e => setForm({...form, standard: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-400">Due Date</Label>
                <Input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">Assignment Title</Label>
              <Input placeholder="Chapter 5 Exercises" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">Description</Label>
              <Textarea placeholder="Instructions for students..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <Button onClick={handleAdd} className="w-full" disabled={loading}>
              {loading ? "Publishing..." : "Publish to All Students"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 pb-20">
        {items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-300">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-10" />
            <p className="font-black uppercase tracking-widest text-sm opacity-20">No homework assigned yet</p>
          </div>
        ) : (
          items.map((i) => (
            <Card key={i.id} className="border-none shadow-sm ring-1 ring-gray-100 hover:ring-blue-100 transition-all overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-[#1B2B4E] tracking-tight">{i.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded italic">
                            {i.subject}
                         </span>
                         <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Users className="h-3.5 w-3.5" /> Class {i.standard}
                         </span>
                         <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                            <Calendar className="h-3.5 w-3.5" /> Due: {i.due_date}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => toggleSubmissions(i.id)} 
                      className={cn(
                        "rounded-xl h-10 px-5 text-xs font-black uppercase tracking-widest border-gray-100 shadow-sm transition-all",
                        expandedHw === i.id ? "bg-blue-600 text-white border-blue-600 shadow-blue-900/10" : "text-gray-500 hover:text-blue-600"
                      )}
                    >
                      <Eye className="h-4 w-4 mr-2" /> 
                      {expandedHw === i.id ? "Hide" : "Review Submissions"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50" 
                      onClick={() => handleDelete(i.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Submissions Section */}
                {expandedHw === i.id && (
                  <div className="bg-gray-50/50 border-t border-gray-100 p-8 animate-in slide-in-from-top-2 duration-300">
                     <div className="flex items-center justify-between mb-6">
                        <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                           <Users className="h-4 w-4 text-blue-500" /> Student Submissions Feed
                        </h5>
                        {!submissions[i.id] ? <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" /> : (
                           <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                             {submissions[i.id].length} Turned In
                           </span>
                        )}
                     </div>
                     <div className="grid gap-4">
                        {!submissions[i.id] || submissions[i.id].length === 0 ? (
                           <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-inner">
                              <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic opacity-50">No uploads received yet</p>
                           </div>
                        ) : (
                          submissions[i.id].map((sub) => (
                            <div key={sub.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="h-11 w-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/20 ring-4 ring-white">
                                     {sub.profiles?.full_name?.charAt(0)}
                                  </div>
                                  <div>
                                     <p className="text-sm font-black text-[#1B2B4E] tracking-tight">{sub.profiles?.full_name}</p>
                                     <div className="flex items-center gap-2 mt-1">
                                        <Clock className="h-3 w-3 text-emerald-400" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(sub.submitted_at).toLocaleString()}</p>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
                                  <div className="w-full md:flex-1 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100/50 italic text-xs font-medium text-gray-600 shadow-inner">
                                     "{sub.content}"
                                  </div>
                                  {sub.content.includes('http') && (
                                    <a 
                                      href={sub.content.startsWith('http') ? sub.content : `https://${sub.content}`} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="h-11 w-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm group/link"
                                    >
                                       <ExternalLink className="h-4 w-4 group-hover/link:scale-110 transition-transform" />
                                    </a>
                                  )}
                                </div>
                            </div>
                          ))
                        )}
                     </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Homework;
