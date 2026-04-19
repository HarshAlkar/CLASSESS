import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface Announcement { id: string; title: string; description: string; created_at: string }

const Announcements = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("announcements").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems((data as Announcement[]) ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-tight py-12">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Notice board</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold">Announcements</h1>
        </div>
      </section>

      <section className="container-tight py-12">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">{a.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{a.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Announcements;
