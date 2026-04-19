import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Megaphone, Trash2, Plus, Calendar, Clock, Edit2 } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const Announcements = () => {
  const { profile } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const fetchItems = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems((data as Announcement[]) ?? []);
  };

  useEffect(() => { 
     fetchItems(); 
     const ch = supabase.channel('ann_adm').on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => fetchItems()).subscribe();
     return () => { supabase.removeChannel(ch); };
  }, []);

  const handleAdd = async () => {
    if (!form.title || !form.description) return toast.error("Both title and description are required.");
    setLoading(true);
    const { error } = await supabase.from("announcements").insert([{ ...form, faculty_id: profile?.id }]);
    if (error) toast.error(error.message);
    else {
      toast.success("Broadcast published!");
      setShowAdd(false);
      setForm({ title: "", description: "" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (!error) toast.success("Announcement recalled.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#1B2B4E] tracking-tight text-right md:text-left">Global Announcements</h2>
          <p className="text-gray-500 font-medium mt-1">Broadcast important news to all active students and faculty.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className={`${showAdd ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-none border' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-900/10'} rounded-xl h-11 px-6 transition-all`}>
          {showAdd ? "Close Panel" : <><Plus className="h-4 w-4 mr-2" /> Create Broadcast</>}
        </Button>
      </div>

      {showAdd && (
        <Card className="border-none shadow-2xl ring-1 ring-blue-500/10 bg-white overflow-hidden animate-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-blue-50/30 border-b border-blue-100/50 py-4">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-400" /> Draft New Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Headline Message</Label>
              <Input 
                placeholder="e.g. Diwaldi Vacation Holidays Notice" 
                className="h-12 border-gray-100 shadow-inner bg-gray-50/30 text-lg font-bold placeholder:text-gray-200 rounded-xl"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Detailed Description</Label>
              <Textarea 
                placeholder="Enter the full message here..." 
                className="min-h-[150px] border-gray-100 shadow-inner bg-gray-50/30 font-medium placeholder:text-gray-200 rounded-xl leading-relaxed"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              />
            </div>
            <div className="flex justify-end py-2">
              <Button onClick={handleAdd} disabled={loading} className="w-full md:w-auto px-12 bg-[#1B2B4E] hover:bg-black text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-900/10">
                {loading ? "Distributing..." : "Publish Announcement"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 flex flex-col items-center justify-center gap-3">
             <Megaphone className="h-12 w-12 opacity-10" />
             <p className="font-black uppercase tracking-widest text-sm opacity-20">No active announcements</p>
          </div>
        ) : (
          items.map((i) => (
            <Card key={i.id} className="border-none shadow-sm ring-1 ring-gray-100 bg-white hover:ring-blue-100 transition-all group overflow-hidden">
               <div className="w-1.5 h-full bg-blue-600 absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity" />
               <CardContent className="p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                 <div className="space-y-3 flex-1">
                   <div className="flex items-center gap-3">
                      <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <Megaphone className="h-5 w-5" />
                      </div>
                      <h4 className="text-xl font-black text-[#1B2B4E] leading-tight">{i.title}</h4>
                   </div>
                   <p className="text-gray-500 font-medium leading-relaxed whitespace-pre-wrap pl-1">{i.description}</p>
                   <div className="flex items-center gap-4 pt-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <Calendar className="h-3 w-3 text-emerald-500" /> {new Date(i.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <Clock className="h-3 w-3 text-blue-500" /> {new Date(i.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                 </div>
                 <div className="flex items-center justify-end gap-2 shrink-0">
                    <Button variant="ghost" size="sm" className="h-10 w-10 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                       <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-10 w-10 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      onClick={() => handleDelete(i.id)}
                    >
                       <Trash2 className="h-4 w-4" />
                    </Button>
                 </div>
               </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcements;
