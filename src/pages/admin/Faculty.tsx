import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ShieldCheck, Trash2, Search, Mail, ChevronRight, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Faculty {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
}

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFaculty = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("requested_role", "faculty")
      .eq("status", "approved")
      .order("full_name", { ascending: true });
    setFaculty((data as Faculty[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchFaculty(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this faculty member?")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (!error) {
       toast.success("Faculty member removed from system.");
       fetchFaculty();
    }
  };

  const filtered = faculty.filter(f => 
    f.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#1B2B4E] tracking-tight">Faculty Directory</h2>
          <p className="text-gray-500 font-medium mt-1">Institutional records of all approved and active teachers.</p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search faculty name/email..." 
            className="pl-10 h-10 border-gray-200 shadow-sm rounded-xl"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-gray-100">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-4 pl-8">Faculty Principal</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-4 text-center">Contact Email</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-4 text-center">Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-4 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-20 text-gray-400 italic">Accessing faculty vault...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-24 text-gray-300">
                    <UserCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-black uppercase tracking-widest opacity-20">No active faculty records</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((f) => (
                  <TableRow key={f.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="py-5 pl-8">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black">
                            {f.full_name?.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-900">{f.full_name}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center py-5">
                       <span className="text-sm text-gray-500 font-medium flex items-center justify-center gap-2"><Mail className="h-3.5 w-3.5 opacity-40" /> {f.email}</span>
                    </TableCell>
                    <TableCell className="text-center py-5">
                       <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-100 uppercase text-[10px] font-black">ACTIVE MEMBER</Badge>
                    </TableCell>
                    <TableCell className="text-right py-5 pr-8">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-red-500" onClick={() => handleDelete(f.id)}>
                             <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-blue-600">
                             <ChevronRight className="h-4 w-4" />
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyManagement;
