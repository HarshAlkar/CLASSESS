import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bell, Plus, Trash2 } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

const Notices = () => {
  const { profile } = useAuth();
  const [items, setItems] = useState<Notice[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const fetchItems = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems((data as Notice[]) ?? []);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.description) return toast.error("Fill all fields");
    setLoading(true);
    const { error } = await supabase.from("announcements").insert([{ ...form, faculty_id: profile?.id }]);
    if (error) toast.error(error.message);
    else {
      toast.success("Notice published!");
      setShowAdd(false);
      fetchItems();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Institute Notices</h2>
          <p className="text-sm text-gray-500 mt-1">Post public announcements for all students.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> Post Notice</>}
        </Button>
      </div>

      {showAdd && (
        <Card className="border-none shadow-md ring-1 ring-gray-100">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">Notice Title</Label>
              <Input placeholder="Holiday Announcement / Exam Schedule" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">Detailed Message</Label>
              <Textarea placeholder="Type the full notice content here..." rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <Button onClick={handleAdd} className="w-full bg-primary" disabled={loading}>
              Post to Announcement Board
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {items.map((n) => (
          <Card key={n.id} className="border-none shadow-sm ring-1 ring-gray-100 bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mt-1">{n.title}</h4>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{n.description}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-red-500 shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notices;
