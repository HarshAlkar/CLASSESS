import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // BACKDOOR BYPASS for the user
    if (form.email === "admin@shreeclasses.com" && form.password === "admin123") {
      toast.success("Welcome (Master Admin)");
      localStorage.setItem("admin_bypass", "true");
      navigate("/admin");
      return;
    }

    if (form.email === "faculty@shreeclasses.com" && form.password === "faculty123") {
      toast.success("Welcome (Master Faculty)");
      localStorage.setItem("faculty_bypass", "true");
      navigate("/faculty");
      return;
    }

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    // Clear all bypass flags for real logins
    localStorage.removeItem("admin_bypass");
    localStorage.removeItem("faculty_bypass");
    localStorage.removeItem("student_bypass");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    if (error || !data.user) {
      setLoading(false);
      toast.error(error?.message ?? "Login failed");
      return;
    }

    // Check approval status
    const { data: profile } = await supabase.from("profiles").select("status, requested_role").eq("id", data.user.id).maybeSingle();
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    setLoading(false);

    if (!profile || profile.status === "pending") {
      await supabase.auth.signOut();
      toast.error("Your account is pending admin approval.");
      return;
    }
    if (profile.status === "rejected") {
      await supabase.auth.signOut();
      toast.error("Your account request was rejected. Please contact the institute.");
      return;
    }

    toast.success("Welcome back!");
    const r = (roles ?? []).map((x) => x.role);
    if (r.includes("admin")) navigate("/admin");
    else if (r.includes("faculty")) navigate("/faculty");
    else navigate("/student");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-semibold text-primary text-lg">Shree Classes</span>
        </Link>
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold">Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Student & Faculty access</p>
            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Login"}
              </Button>
            </form>
            <p className="text-center mt-6 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
            <div className="pt-6 border-t border-gray-100 flex flex-col gap-2 mt-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    localStorage.setItem("faculty_bypass", "false");
                    localStorage.setItem("admin_bypass", "false");
                    localStorage.setItem("student_bypass", "true");
                    localStorage.setItem("user", JSON.stringify({ id: "student-1", full_name: "Test Student", standard: "10th", requested_role: "student", status: "approved" }));
                    navigate("/student");
                  }} 
                  variant="outline" className="flex-1 text-[10px] font-black border-gray-100 h-8"
                >
                  STU BYPASS
                </Button>
                <Button 
                  onClick={() => {
                    localStorage.setItem("faculty_bypass", "true");
                    localStorage.setItem("admin_bypass", "false");
                    localStorage.setItem("student_bypass", "false");
                    localStorage.setItem("user", JSON.stringify({ id: "faculty-1", full_name: "Test Teacher", requested_role: "faculty", status: "approved" }));
                    navigate("/faculty");
                  }} 
                  variant="outline" className="flex-1 text-[10px] font-black border-gray-100 h-8"
                >
                  FAC BYPASS
                </Button>
              </div>
              <Button 
                onClick={() => {
                  localStorage.setItem("admin_bypass", "true");
                  localStorage.setItem("faculty_bypass", "false");
                  localStorage.setItem("student_bypass", "false");
                  localStorage.setItem("user", JSON.stringify({ 
                    id: "admin-1", 
                    full_name: "Super Admin", 
                    requested_role: "admin", 
                    status: "approved",
                    created_at: new Date().toISOString()
                  }));
                  navigate("/admin");
                }} 
                variant="outline" 
                className="w-full text-[10px] font-black border-blue-50 text-blue-600 bg-blue-50 hover:bg-blue-100 h-8 shadow-sm tracking-widest"
              >
                👑 LOGIN AS SUPER ADMIN
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
