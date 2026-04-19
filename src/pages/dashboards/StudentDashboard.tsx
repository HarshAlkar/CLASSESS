import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface Announcement { id: string; title: string; description: string; created_at: string }

const StudentDashboard = () => {
  const { profile } = useAuth();
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    supabase.from("announcements").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Announcement[]) ?? []));
  }, []);

  return (
    <DashboardShell title="Student Dashboard">
      <div className="container-tight py-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">My Profile</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row k="Name" v={profile?.full_name} />
              <Row k="Email" v={profile?.email} />
              <Row k="Medium" v={profile?.medium ?? "—"} />
              <Row k="Standard" v={profile?.standard ?? "—"} />
              <Row k="Status" v={<span className="capitalize text-primary font-medium">{profile?.status}</span>} />
            </dl>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold">Course Details</h2>
              <p className="text-sm text-muted-foreground mt-1">
                You are enrolled in <strong className="text-foreground">{profile?.medium} medium</strong>, {profile?.standard}.
                Attend classes regularly and check the announcements below for updates.
              </p>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-semibold mb-3">Announcements</h2>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            ) : (
              <div className="space-y-3">
                {items.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <h3 className="mt-1 font-semibold">{a.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex justify-between gap-3 border-b border-border pb-2 last:border-0">
    <dt className="text-muted-foreground">{k}</dt>
    <dd className="text-right">{v}</dd>
  </div>
);

export default StudentDashboard;
