import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Video, Trash2, Link as LinkIcon } from "lucide-react";

interface Lecture {
  id: string;
  subject: string;
  topic: string;
  date: string;
  video_url: string;
}

const Lectures = () => {
  const { profile } = useAuth();
  const [items, setItems] = useState<Lecture[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ subject: "", topic: "", date: "", video_url: "", standard: "" });

  const fetchItems = async () => {
    const { data } = await supabase.from("lectures").select("*").order("date", { ascending: false });
    setItems((data as Lecture[]) ?? []);
  };

  useEffect(() => { 
    fetchItems(); 
    const channel = supabase.channel('lec_fac').on('postgres_changes', { event: '*', schema: 'public', table: 'lectures' }, () => fetchItems()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleAdd = async () => {
    if (!form.subject || !form.topic || !form.standard) return toast.error("Fill mandatory fields (Subject, Topic, Standard)");
    setLoading(true);
    const { error } = await supabase.from("lectures").insert([{ ...form, faculty_id: profile?.id }]);
    if (error) toast.error(error.message);
    else {
      toast.success("Lecture session added!");
      setShowAdd(false);
      setForm({ subject: "", topic: "", date: "", video_url: "", standard: "" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lecture Archive</h2>
          <p className="text-sm text-gray-500 mt-1">Manage video recordings and session schedules.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> Add Session</>}
        </Button>
      </div>

      {showAdd && (
        <Card className="border-none shadow-md ring-1 ring-gray-100 pb-2">
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-400">Subject</Label>
                <Input placeholder="e.g. Chemistry" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-400">Standard</Label>
                <Input placeholder="e.g. 10th" value={form.standard} onChange={e => setForm({...form, standard: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-400">Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">Topic / Title</Label>
              <Input placeholder="Periodic Table Fundamentals" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">Video Link (Optional)</Label>
              <Input placeholder="https://youtube.com/..." value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} />
            </div>
            <Button onClick={handleAdd} className="w-full" disabled={loading}>
              Save Session Detail
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Card key={i.id} className="border-none shadow-sm ring-1 ring-gray-100 bg-white group overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                  <Video className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{i.date}</span>
              </div>
              <h4 className="mt-4 font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight min-h-[2.5rem] line-clamp-2">
                {i.topic}
              </h4>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase">{i.subject}</p>
              
              <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                <span className="text-xs font-medium text-gray-300">Video Record</span>
                {i.video_url ? (
                  <a href={i.video_url} target="_blank" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    VIEW LINK <LinkIcon className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[10px] font-bold text-gray-300">N/A</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Lectures;
