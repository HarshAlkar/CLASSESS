import { Link } from "react-router-dom";
import { Phone, MapPin, BookOpen, Users, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Announcement { id: string; title: string; description: string; created_at: string }

const Index = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setAnnouncements((data as Announcement[]) ?? []));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background border-b border-border">
        <div className="container-tight py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-medium uppercase tracking-wider text-primary bg-accent px-3 py-1 rounded">
              Trusted Coaching since years
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              Shree Classes — Quality education in a nurturing environment
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl">
              Coaching for Standards 3–10 in English & Marathi medium. Located in Kalyan West,
              near Birla College.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/contact">Enroll Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/courses">View Courses</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> 9867897622</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Kalyan West</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <Stat label="Standards" value="3–10" />
                <Stat label="Mediums" value="EN & MR" />
                <Stat label="Board Prep" value="✓" />
                <Stat label="Doubt Solving" value="Daily" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses overview */}
      <section className="container-tight py-14">
        <SectionHeader title="Courses Overview" subtitle="What we teach" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <FeatureCard icon={<BookOpen className="h-5 w-5" />} title="English Medium" text="Standards 8 to 10. Concept clarity, regular tests, and mentoring." />
          <FeatureCard icon={<Users className="h-5 w-5" />} title="Marathi Medium" text="Standards 3 to 10. Strong fundamentals with personal attention." />
          <FeatureCard icon={<Award className="h-5 w-5" />} title="Board Preparation" text="Revision tests, doubt solving sessions and mentoring for board exams." />
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" asChild><Link to="/courses">See all courses</Link></Button>
        </div>
      </section>

      {/* About preview */}
      <section className="bg-secondary/40 border-y border-border">
        <div className="container-tight py-14 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <SectionHeader title="About Shree Classes" subtitle="Who we are" />
            <p className="mt-4 text-muted-foreground">
              Shree Classes is a trusted coaching institute located in Kalyan West, near Birla
              College. Our focus is on conceptual clarity, regular practice and personal mentoring
              to help every student perform their best.
            </p>
            <Button className="mt-5" variant="outline" asChild>
              <Link to="/about">Read more</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Pillar title="Mission" text="Help every student build a strong academic foundation." />
            <Pillar title="Values" text="Discipline, honesty and dedication." />
            <Pillar title="Approach" text="Small batches with focused attention." />
            <Pillar title="Result" text="Consistent improvement, confident students." />
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="container-tight py-14">
        <div className="flex items-end justify-between">
          <SectionHeader title="Latest Announcements" subtitle="Stay updated" />
          <Link to="/announcements" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {announcements.length === 0 && (
            <p className="text-sm text-muted-foreground">No announcements yet.</p>
          )}
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">
                  {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <h3 className="mt-1 text-base font-semibold">{a.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">{a.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact strip */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-tight py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-primary-foreground">Ready to enroll?</h3>
            <p className="text-sm opacity-90">Call us or visit our institute in Kalyan West.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" asChild><Link to="/contact">Contact us</Link></Button>
            <a href="tel:9867897622" className="inline-flex items-center gap-2 px-4 py-2 rounded border border-primary-foreground/30 text-sm">
              <Phone className="h-4 w-4" /> 9867897622
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded border border-border bg-background p-4 text-center">
    <div className="text-2xl font-bold text-primary">{value}</div>
    <div className="text-xs text-muted-foreground mt-1">{label}</div>
  </div>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{subtitle}</p>
    <h2 className="mt-1 text-2xl md:text-3xl font-semibold">{title}</h2>
  </div>
);

const FeatureCard = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded bg-accent text-primary">
        {icon}
      </div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
    </CardContent>
  </Card>
);

const Pillar = ({ title, text }: { title: string; text: string }) => (
  <div className="rounded border border-border bg-background p-4">
    <h4 className="text-sm font-semibold text-primary">{title}</h4>
    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
  </div>
);

export default Index;
