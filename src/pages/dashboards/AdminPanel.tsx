import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, GraduationCap as GradIcon, Megaphone, Inbox, LogOut, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface Profile {
  id: string; full_name: string; email: string; requested_role: string;
  status: "pending" | "approved" | "rejected"; medium: string | null; standard: string | null;
}
interface Announcement { id: string; title: string; description: string; created_at: string }
interface Enquiry { id: string; name: string; standard: string; phone: string; message: string; created_at: string }

const AdminLayout = () => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const linkClass = "flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-foreground/80 hover:bg-accent transition-colors";
  const activeClass = "bg-accent text-primary";

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <header className="bg-background border-b border-border">
        <div className="container-tight flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold text-primary">Shree Classes</div>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted-foreground">{profile?.full_name}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}><LogOut className="h-4 w-4 mr-1.5" /> Sign out</Button>
          </div>
        </div>
      </header>

      <div className="container-tight py-6 grid gap-6 md:grid-cols-[220px,1fr]">
        <aside>
          <nav className="space-y-1">
            <RouterNavLink to="/admin" end className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
              <Users className="h-4 w-4" /> Students
            </RouterNavLink>
            <RouterNavLink to="/admin/faculty" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
              <GradIcon className="h-4 w-4" /> Faculty
            </RouterNavLink>
            <RouterNavLink to="/admin/announcements" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
              <Megaphone className="h-4 w-4" /> Announcements
            </RouterNavLink>
            <RouterNavLink to="/admin/enquiries" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
              <Inbox className="h-4 w-4" /> Enquiries
            </RouterNavLink>
          </nav>
        </aside>
        <section><Outlet /></section>
      </div>
    </div>
  );
};

const PeopleTable = ({ role }: { role: "student" | "faculty" }) => {
  const [items, setItems] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").eq("requested_role", role).order("created_at", { ascending: false });
    setItems((data as Profile[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [role]);

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Marked ${status}`); load(); }
  };

  const statusBadge = (s: Profile["status"]) => {
    if (s === "approved") return <Badge className="bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]">Approved</Badge>;
    if (s === "pending") return <Badge variant="secondary">Pending</Badge>;
    return <Badge variant="destructive">Rejected</Badge>;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold capitalize">{role} Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Approve or reject signup requests.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Standard</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6 text-sm">Loading…</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6 text-sm">No {role}s yet.</TableCell></TableRow>
            ) : items.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name}</TableCell>
                <TableCell className="text-muted-foreground">{p.email}</TableCell>
                <TableCell>{p.medium ?? "—"}</TableCell>
                <TableCell>{p.standard ?? "—"}</TableCell>
                <TableCell>{statusBadge(p.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  {p.status !== "approved" && <Button size="sm" onClick={() => setStatus(p.id, "approved")}>Approve</Button>}
                  {p.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => setStatus(p.id, "rejected")}>Reject</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const annSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(2000),
});

const AnnouncementsAdmin = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems((data as Announcement[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = annSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    const payload = { title: parsed.data.title, description: parsed.data.description };
    if (editingId) {
      const { error } = await supabase.from("announcements").update(payload).eq("id", editingId);
      if (error) return toast.error(error.message);
      toast.success("Announcement updated");
    } else {
      const { error } = await supabase.from("announcements").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Announcement created");
    }
    setForm({ title: "", description: "" });
    setEditingId(null);
    load();
  };

  const edit = (a: Announcement) => { setEditingId(a.id); setForm({ title: a.title, description: a.description }); };
  const remove = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold">{editingId ? "Edit announcement" : "New announcement"}</h2>
          <form onSubmit={save} className="mt-4 space-y-3">
            <div>
              <Label htmlFor="t">Title</Label>
              <Input id="t" className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={150} />
            </div>
            <div>
              <Label htmlFor="d">Description</Label>
              <Textarea id="d" className="mt-1.5" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={2000} />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Update" : "Publish"}</Button>
              {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ title: "", description: "" }); }}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-5">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  <h3 className="mt-1 font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button size="icon" variant="outline" onClick={() => edit(a)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" onClick={() => remove(a.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const EnquiriesAdmin = () => {
  const [items, setItems] = useState<Enquiry[]>([]);
  useEffect(() => {
    supabase.from("enquiries").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Enquiry[]) ?? []));
  }, []);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Enquiries</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Submissions from the contact form.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Std</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6 text-sm">No enquiries yet.</TableCell></TableRow>
            ) : items.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{new Date(e.created_at).toLocaleDateString("en-IN")}</TableCell>
                <TableCell className="font-medium">{e.name}</TableCell>
                <TableCell>{e.standard}</TableCell>
                <TableCell>{e.phone}</TableCell>
                <TableCell className="max-w-md text-sm text-muted-foreground">{e.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const AdminPanel = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<PeopleTable role="student" />} />
      <Route path="faculty" element={<PeopleTable role="faculty" />} />
      <Route path="announcements" element={<AnnouncementsAdmin />} />
      <Route path="enquiries" element={<EnquiriesAdmin />} />
    </Route>
  </Routes>
);

export default AdminPanel;
