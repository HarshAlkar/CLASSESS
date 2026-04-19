import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    standard: "",
    medium: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          requested_role: role,
          standard: role === 'student' ? form.standard : null,
          medium: role === 'student' ? form.medium : null,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registration request sent! Please wait for admin approval.");
      navigate("/login");
    }
    setLoading(false);
  };

  if (step === "choose") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#1B2B4E]">Join Shree Classes</h1>
            <p className="text-gray-500 mt-2">Select your role to continue with registration</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <RoleCard 
              title="I am a Student" 
              desc="Access your homework, lectures, and attendance."
              icon={<GraduationCap className="h-10 w-10" />}
              onClick={() => { setRole("student"); setStep("form"); }}
            />
            <RoleCard 
              title="I am a Faculty" 
              desc="Manage classes, mark attendance, and upload materials."
              icon={<Briefcase className="h-10 w-10" />}
              onClick={() => { setRole("faculty"); setStep("form"); }}
            />
          </div>

          <p className="text-center mt-10 text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center text-primary mb-4">
            {role === 'student' ? <GraduationCap /> : <Briefcase />}
          </div>
          <CardTitle className="text-xl font-bold">
            {role === 'student' ? "Student Registration" : "Faculty Registration"}
          </CardTitle>
          <CardDescription>Join our academy as a {role}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">Full Name</Label>
              <Input required placeholder="Enter your full name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">Email Address</Label>
              <Input required type="email" placeholder="name@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase font-bold text-gray-400">Password</Label>
              <Input required type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>

            {role === 'student' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-400">Standard / Class</Label>
                  <Input placeholder="e.g. 10th" value={form.standard} onChange={e => setForm({...form, standard: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-400">Medium</Label>
                  <Input placeholder="English / Marathi" value={form.medium} onChange={e => setForm({...form, medium: e.target.value})} />
                </div>
              </div>
            )}

            <Button className="w-full bg-[#1B2B4E]" disabled={loading}>
              {loading ? "Processing..." : "Create Account"}
            </Button>
            
            <Button variant="ghost" className="w-full text-xs text-gray-400 hover:text-primary" onClick={() => setStep("choose")}>
              ← Change Role
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const RoleCard = ({ title, desc, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className="bg-white p-8 rounded-2xl border-2 border-transparent hover:border-primary hover:shadow-2xl transition-all duration-300 text-left group"
  >
    <div className="bg-gray-50 h-16 w-16 rounded-xl flex items-center justify-center text-[#1B2B4E] group-hover:bg-primary group-hover:text-white transition-colors mb-6 shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#1B2B4E]">{title}</h3>
    <p className="text-gray-500 mt-2 text-sm leading-relaxed">{desc}</p>
    <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm">
      Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
);

export default Signup;
