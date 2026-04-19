import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const PageHeader = ({ title, sub }: { title: string; sub: string }) => (
  <section className="border-b border-border bg-secondary/40">
    <div className="container-tight py-12">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{sub}</p>
      <h1 className="mt-1 text-3xl md:text-4xl font-semibold">{title}</h1>
    </div>
  </section>
);

const Courses = () => (
  <>
    <PageHeader title="Courses Offered" sub="Academics" />
    <section className="container-tight py-12 grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">English Medium</h2>
          <p className="text-sm text-muted-foreground mt-1">Standards 8 – 10</p>
          <ul className="mt-4 space-y-2 text-sm">
            <Item>Standard 8</Item>
            <Item>Standard 9</Item>
            <Item>Standard 10 (SSC Board)</Item>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Marathi Medium</h2>
          <p className="text-sm text-muted-foreground mt-1">Standards 3 – 10</p>
          <ul className="mt-4 space-y-2 text-sm">
            <Item>Standards 3 to 7 (Foundation)</Item>
            <Item>Standards 8 & 9</Item>
            <Item>Standard 10 (SSC Board)</Item>
          </ul>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Board Preparation</h2>
          <p className="text-sm text-muted-foreground mt-1">Focused support for Std 10 board exams</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Pill title="Revision Tests" text="Weekly tests with detailed feedback." />
            <Pill title="Doubt Solving" text="Daily one-on-one doubt clearing." />
            <Pill title="Mentoring" text="Personal guidance throughout the year." />
          </div>
        </CardContent>
      </Card>
    </section>
  </>
);

const Item = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2 text-foreground"><Check className="h-4 w-4 text-primary" /> {children}</li>
);

const Pill = ({ title, text }: { title: string; text: string }) => (
  <div className="rounded border border-border bg-secondary/40 p-4">
    <h4 className="font-semibold text-primary">{title}</h4>
    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
  </div>
);

export default Courses;
