import { Card, CardContent } from "@/components/ui/card";

const About = () => (
  <>
    <section className="border-b border-border bg-secondary/40">
      <div className="container-tight py-12">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Our story</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-semibold">About Shree Classes</h1>
      </div>
    </section>

    <section className="container-tight py-12 grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Block title="Who We Are">
          Shree Classes is a trusted coaching institute located in Kalyan West, near Birla College.
          We provide tuition for students from Standard 3 through Standard 10 in both English and
          Marathi medium, with a focus on building strong fundamentals and exam confidence.
        </Block>

        <Block title="Our Mission">
          To make quality education accessible and effective — helping every student understand
          concepts deeply, practice consistently and grow with confidence.
        </Block>

        <Block title="Our Values">
          Discipline, honesty, dedication and respect — these are the values we encourage in every
          student who studies with us.
        </Block>

        <Block title="Our Approach">
          Small batches, regular tests, personal mentoring, doubt solving sessions and continuous
          parent communication. We believe progress comes from consistency, not pressure.
        </Block>
      </div>

      <div className="space-y-4">
        <Card><CardContent className="p-5"><h4 className="font-semibold text-primary">Location</h4><p className="text-sm text-muted-foreground mt-1">Birla College area, Kalyan West</p></CardContent></Card>
        <Card><CardContent className="p-5"><h4 className="font-semibold text-primary">Mediums</h4><p className="text-sm text-muted-foreground mt-1">English & Marathi</p></CardContent></Card>
        <Card><CardContent className="p-5"><h4 className="font-semibold text-primary">Standards</h4><p className="text-sm text-muted-foreground mt-1">3 to 10</p></CardContent></Card>
        <Card><CardContent className="p-5"><h4 className="font-semibold text-primary">Contact</h4><p className="text-sm text-muted-foreground mt-1">9867897622</p></CardContent></Card>
      </div>
    </section>
  </>
);

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="mt-2 text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

export default About;
