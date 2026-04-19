import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Phone, User, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  standard: string;
  message: string;
  created_at: string;
}

const Enquiries = () => {
  const [data, setData] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data: records } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    setData((records as Enquiry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (!error) {
      toast.success("Enquiry deleted.");
      fetchEnquiries();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-[#1B2B4E] tracking-tight">New Lead Enquiries</h2>
        <p className="text-gray-500 font-medium mt-1">Direct messages and requests from potential students and parents.</p>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-medium italic">Loading leads...</div>
        ) : data.length === 0 ? (
          <div className="p-24 bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
             <MessageSquare className="h-12 w-12 mb-4 opacity-10" />
             <p className="font-black uppercase tracking-widest text-sm opacity-20">Inbox Empty</p>
          </div>
        ) : (
          data.map((item) => (
            <Card key={item.id} className="border-none shadow-sm ring-1 ring-gray-100 bg-white hover:ring-blue-100 transition-all group">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h4>
                        <div className="flex items-center gap-3 mt-1 underline-offset-4 font-bold text-blue-600/60">
                          <span className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3" /> {item.phone}</span>
                          <span className="h-1 w-1 bg-gray-200 rounded-full" />
                          <span className="text-xs uppercase tracking-widest">Class {item.standard}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50/50 p-4 rounded-xl text-gray-600 text-sm leading-relaxed border border-gray-100/50 italic">
                       "{item.message}"
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-4 min-w-[120px]">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-emerald-500" /> {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Mark as Done
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Enquiries;
