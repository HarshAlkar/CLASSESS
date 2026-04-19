import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, Trash2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Student {
  id: string;
  full_name: string;
  email: string;
  standard: string;
  medium: string;
  status: string;
  created_at: string;
}

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("requested_role", "student")
      .eq("status", "approved")
      .order("full_name", { ascending: true });
    setStudents((data as Student[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("CONFIRMATION REQUIRED: Permanently delete student record? This action is irreversible.")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (!error) {
       toast.success("Record deleted successfully.");
       fetchStudents();
    }
  };

  const filtered = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 uppercase">Registered Student Records</h2>
          <p className="text-xs text-slate-500 font-medium">Directory of all verified students in the system.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Input 
            placeholder="Search Record..." 
            className="h-9 border-slate-200 text-xs font-bold ring-offset-transparent focus-visible:ring-0 rounded-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="text-[10px] font-bold text-slate-600 uppercase py-3 border-r border-slate-200">Student Name / Email</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-600 uppercase py-3 text-center border-r border-slate-200">Standard</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-600 uppercase py-3 text-center border-r border-slate-200">Medium</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-600 uppercase py-3 text-center border-r border-slate-200">Status</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-600 uppercase py-3 text-right">Utility</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-widest">Awaiting Server Response...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-300 text-xs font-bold uppercase">No records found matching criteria</TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <TableCell className="py-4 border-r border-slate-200">
                    <p className="text-sm font-bold text-slate-800">{s.full_name}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" /> {s.email}</p>
                  </TableCell>
                  <TableCell className="text-center border-r border-slate-200">
                    <span className="text-xs font-bold text-slate-600 border border-slate-200 px-2 py-0.5 bg-slate-50">{s.standard || 'UND'}</span>
                  </TableCell>
                  <TableCell className="text-center border-r border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.medium || 'UND'}</span>
                  </TableCell>
                  <TableCell className="text-center border-r border-slate-200">
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 border border-green-100 uppercase tracking-wider">Verified</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="text-slate-400 hover:text-red-600 p-2 transition-colors inline-flex items-center gap-1.5"
                      title="Purge Record"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-[9px] font-black uppercase hidden sm:inline">Delete</span>
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-slate-50 p-2 px-4 border border-slate-200 rounded-sm">
         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Total Records Managed: {filtered.length} | System Log: {new Date().toLocaleDateString('en-GB')}</p>
      </div>
    </div>
  );
};

export default StudentManagement;
