import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, FileText, Trash2, Download } from "lucide-react";

interface Material {
  id: string;
  subject: string;
  title: string;
  file_url: string;
  created_at: string;
}

const Materials = () => {
  const { profile } = useAuth();
  const [items, setItems] = useState<Material[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ subject: "", title: "", file_url: "" });

  const fetchItems = async () => {
    const { data } = await supabase.from("materials").select("*").order("created_at", { ascending: false });
    setItems((data as Material[]) ?? []);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!form.subject || !form.title || !form.file_url) return toast.error("Fill all fields");
    setLoading(true);
    const { error } = await supabase.from("materials").insert([{ ...form, faculty_id: profile?.id }]);
    if (error) toast.error(error.message);
    else {
      toast.success("Study material uploaded!");
      setShowAdd(false);
      fetchItems();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Materials</h2>
          <p className="text-sm text-gray-500 mt-1">Upload and manage PDFs and resources.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Cancel" : <><Plus className="h-4 w-4 mr-2" /> Upload Material</>}
        </Button>
      </div>

      {showAdd && (
        <Card className="border-none shadow-md ring-1 ring-gray-100 pb-2">
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-400">Subject</Label>
                <Input placeholder="e.g. Biology" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-400">Resource Title</Label>
                <Input placeholder="Digestion System Notes" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">File URL (e.g. Google Drive Link)</Label>
              <Input placeholder="https://drive.google.com/..." value={form.file_url} onChange={e => setForm({...form, file_url: e.target.value})} />
            </div>
            <Button onClick={handleAdd} className="w-full" disabled={loading}>
              Upload to Portal
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {items.map((i) => (
          <Card key={i.id} className="border-none shadow-sm ring-1 ring-gray-100 bg-white">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{i.title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{i.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" asChild className="text-primary hover:text-primary hover:bg-primary/5 font-bold text-xs uppercase tracking-tighter">
                  <a href={i.file_url} target="_blank"><Download className="h-3 w-3 mr-2" /> Link</a>
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-red-500">
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

export default Materials;
