import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Mail, ShieldCheck, Briefcase } from "lucide-react";

const Profile = () => {
  const { profile } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div>
        <h2 className="text-2xl font-bold text-gray-900">Faculty Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Your official identification and credentials.</p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 bg-white overflow-hidden">
        <CardHeader className="bg-[#0F172A] text-white p-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold border border-white/20">
               {profile?.full_name?.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">{profile?.full_name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Verified Faculty Member</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-8">
            <div className="grid gap-2">
              <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Basic Profile</Label>
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem icon={<User className="h-4 w-4" />} label="Display Name" value={profile?.full_name} />
                <InfoItem icon={<Mail className="h-4 w-4" />} label="Work Email" value={profile?.email} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Academic Department</Label>
               <div className="grid md:grid-cols-2 gap-6">
                <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Role" value="Faculty Member" />
                <InfoItem icon={<ShieldCheck className="h-4 w-4" />} label="System Access" value="Approved Admin" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoItem = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-3">
    <div className="bg-gray-50 p-2 rounded text-gray-400 shadow-sm">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="text-sm font-bold text-gray-700 mt-1.5">{value || "—"}</p>
    </div>
  </div>
);

export default Profile;
