import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User, Mail, GraduationCap, MapPin, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const { profile, refresh } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
  });

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name })
      .eq("id", profile?.id);
    
    if (error) {
      toast.error(error.message);
    } else {
      await refresh();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1B2B4E]">My Profile</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
          className="border-gray-200 text-gray-600 font-semibold text-xs shadow-none"
        >
          <Pencil className="h-3 w-3 mr-2" /> {isEditing ? "CANCEL" : "EDIT PROFILE"}
        </Button>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 bg-white overflow-hidden">
        <CardHeader className="bg-[#1B2B4E] text-white p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold border border-white/20">
               {profile?.full_name?.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-xl">{profile?.full_name}</CardTitle>
              <p className="text-white/60 text-sm mt-1">Student Access Profile</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-8">
            <div className="grid gap-2">
              <Label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Personal Information</Label>
              <div className="grid gap-4 mt-2">
                <InfoRow 
                  icon={<User className="h-4 w-4" />} 
                  label="Full Name" 
                  value={isEditing ? (
                    <Input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="h-8 text-sm" />
                  ) : profile?.full_name} 
                />
                <InfoRow 
                  icon={<Mail className="h-4 w-4" />} 
                  label="Email Address" 
                  value={profile?.email} 
                  muted 
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Academic Details</Label>
              <div className="grid gap-4 mt-2">
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Standard / Class" value={profile?.standard} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Medium" value={profile?.medium} />
              </div>
            </div>

            {isEditing && (
              <Button onClick={handleUpdate} className="bg-[#1B2B4E] hover:bg-[#1B2B4E]/90" disabled={loading}>
                {loading ? "Saving Changes..." : "Save Profile Details"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center p-6 rounded-lg bg-gray-50 border border-gray-100">
        <p className="text-xs text-gray-400 font-medium">To change your email or password, please contact the institute office.</p>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, muted }: any) => (
  <div className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
    <div className="h-8 w-8 rounded bg-gray-50 flex items-center justify-center text-gray-400">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">{label}</p>
      <div className={cn("text-sm font-semibold mt-1", muted ? "text-gray-400" : "text-[#1B2B4E]")}>
        {value || "—"}
      </div>
    </div>
  </div>
);

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default ProfilePage;
