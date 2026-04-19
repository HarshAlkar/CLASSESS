import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";

interface Announcement { id: string; title: string; description: string; created_at: string }
interface Student { id: string; full_name: string; email: string; medium: string | null; standard: string | null }

const FacultyDashboard = () => {
  const [ann, setAnn] = useState<Announcement[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => setAnn((data as Announcement[]) ?? []));
    supabase.from("profiles").select("id, full_name, email, medium, standard").eq("requested_role", "student").eq("status", "approved")
      .then(({ data }) => setStudents((data as Student[]) ?? []));
  }, []);

  return (
    <DashboardShell title="Faculty Dashboard">
      <div className="container-tight py-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Students (read-only)</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Standard</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6 text-sm">No approved students yet.</TableCell></TableRow>
                  ) : students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.full_name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.email}</TableCell>
                      <TableCell>{s.medium ?? "—"}</TableCell>
                      <TableCell>{s.standard ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Announcements</h2>
          <div className="space-y-3">
            {ann.length === 0 && <p className="text-sm text-muted-foreground">No announcements yet.</p>}
            {ann.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold">{a.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{a.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default FacultyDashboard;
