import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  standard: z.string().trim().min(1, "Please enter standard").max(20),
  phone: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone"),
  message: z.string().trim().min(5, "Please add a short message").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", standard: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert(parsed.data as { name: string; standard: string; phone: string; message: string });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    toast.success("Enquiry submitted. We'll get back to you soon.");
    setForm({ name: "", standard: "", phone: "", message: "" });
  };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-tight py-12">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Get in touch</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold">Contact Us</h1>
        </div>
      </section>

      <section className="container-tight py-12 grid gap-8 md:grid-cols-3">
        <div className="space-y-4">
          <InfoCard icon={<Phone className="h-4 w-4" />} title="Phone" text="9867897622" />
          <InfoCard icon={<Mail className="h-4 w-4" />} title="Email" text="shreeclasses@gmail.com" />
          <InfoCard icon={<MapPin className="h-4 w-4" />} title="Address" text="Birla College area, Kalyan West" />
        </div>

        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Enquiry Form</h2>
            <p className="text-sm text-muted-foreground mt-1">Fill the form and we will reach out.</p>
            <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Name" id="name">
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
              </Field>
              <Field label="Standard" id="standard">
                <Input id="standard" placeholder="e.g. Std 9" value={form.standard} onChange={(e) => setForm({ ...form, standard: e.target.value })} maxLength={20} />
              </Field>
              <Field label="Parent Phone Number" id="phone" full>
                <Input id="phone" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={15} />
              </Field>
              <Field label="Message" id="message" full>
                <Textarea id="message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} />
              </Field>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Enquiry"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

const Field = ({ label, id, full, children }: { label: string; id: string; full?: boolean; children: React.ReactNode }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <Label htmlFor={id}>{label}</Label>
    <div className="mt-1.5">{children}</div>
  </div>
);

const InfoCard = ({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) => (
  <Card>
    <CardContent className="p-5">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-sm font-semibold">{title}</span></div>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </CardContent>
  </Card>
);

export default Contact;
