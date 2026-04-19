import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UserCheck, Save, Calendar as CalendarIcon } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  standard?: string;
}

const Attendance = () => {
  const { profile } = useAuth();
  const [students, setStudents] = useState<Profile[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], subject: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("profiles").select("id, full_name, standard").eq("requested_role", "student")
      .then(({ data }) => setStudents((data as Profile[]) ?? []));
  }, []);

  // Fetch existing attendance for the selected date/subject
  useEffect(() => {
    const fetchExisting = async () => {
      if (!form.subject) return;
      const { data } = await supabase
        .from("attendance")
        .select("user_id, status")
        .eq("date", form.date)
        .eq("subject", form.subject);
      
      if (data) {
        const mapped: Record<string, boolean> = {};
        data.forEach(at => {
          mapped[at.user_id] = at.status === "Present";
        });
        setAttendance(mapped);
      } else {
        setAttendance({});
      }
    };
    fetchExisting();
  }, [form.date, form.subject]);

  const toggleStatus = (id: string) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    if (!form.subject) return toast.error("Please enter a subject");
    setLoading(true);
    
    // UPSERT (Update existing or Insert new)
    const records = students.map(s => ({
      user_id: s.id,
      faculty_id: profile?.id,
      date: form.date,
      subject: form.subject,
      status: attendance[s.id] ? "Present" : "Absent"
    }));

    const { error } = await supabase.from("attendance").upsert(records, { onConflict: 'user_id,date,subject' });
    if (error) {
       // If upsert fails due to missing unique constraint, we just insert
       const { error: insError } = await supabase.from("attendance").insert(records);
       if (insError) toast.error(insError.message);
       else toast.success("Attendance saved!");
    } else {
      toast.success("Attendance updated!");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
        <p className="text-sm text-gray-500 mt-1">Select class parameters and log presence.</p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400 tracking-wider">Date</Label>
              <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400 tracking-wider">Subject / Class</Label>
              <Input placeholder="e.g. Mathematics - 10th" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="border-gray-200" />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                <Save className="h-4 w-4 mr-2" /> {loading ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4 px-6">
          <CardTitle className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-widest">
            <UserCheck className="h-4 w-4" /> Student List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="font-semibold text-gray-600 px-6">Student Name</TableHead>
                <TableHead className="font-semibold text-gray-600">Standard</TableHead>
                <TableHead className="w-[120px] font-semibold text-gray-600 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id} className="border-gray-50">
                  <TableCell className="font-bold text-gray-700 px-6">{s.full_name}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{s.standard}</TableCell>
                  <TableCell className="text-center">
                    <button 
                      onClick={() => toggleStatus(s.id)}
                      className={cn(
                        "text-xs font-bold px-3 py-1 rounded transition-all",
                        attendance[s.id] 
                          ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" 
                          : "bg-red-100 text-red-700 ring-1 ring-red-200"
                      )}
                    >
                      {attendance[s.id] ? "PRESENT" : "ABSENT"}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

import { cn } from "@/lib/utils";

export default Attendance;
