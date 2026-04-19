import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Calendar, LogOut } from "lucide-react";

const AdminProfile = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-[#1B2B4E] tracking-tight text-center md:text-left">Super Admin Profile</h2>
        <p className="text-gray-500 font-medium mt-1 text-center md:text-left">Full control and administrative credentials.</p>
      </div>

      <Card className="border-none shadow-2xl ring-1 ring-gray-100 overflow-hidden bg-white">
        <div className="h-32 bg-[#1B2B4E] relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 grayscale pointer-events-none">
              <Shield className="h-12 w-12" />
              <Shield className="h-12 w-12" />
              <Shield className="h-12 w-12" />
              <Shield className="h-12 w-12" />
           </div>
           <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-3xl bg-white p-2 shadow-xl border border-gray-100">
              <div className="h-full w-full bg-blue-500 rounded-2xl flex items-center justify-center text-white text-4xl font-black">
                 {profile?.full_name?.charAt(0) || "A"}
              </div>
           </div>
        </div>
        
        <CardContent className="pt-20 px-8 pb-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#1B2B4E] tracking-tight">{profile?.full_name}</h3>
                <span className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm bg-blue-50 w-fit px-3 py-1 rounded-full">
                  <Shield className="h-3 w-3" /> System Administrator
                </span>
             </div>
             <Button variant="outline" className="text-red-500 border-red-50 hover:bg-red-50 rounded-xl font-bold text-xs uppercase tracking-widest px-6" onClick={() => signOut()}>
               <LogOut className="h-4 w-4 mr-2" /> Sign Out
             </Button>
          </div>

          <div className="grid gap-6 border-t border-gray-50 pt-8">
             <div className="flex items-center gap-6 group">
                <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-300 border border-gray-100/50 shadow-inner">
                   <Mail className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Identity</span>
                   <span className="font-bold text-gray-700">{profile?.email}</span>
                </div>
             </div>

             <div className="flex items-center gap-6 group">
                <div className="h-12 w-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-300 border border-gray-100/50 shadow-inner">
                   <Calendar className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Since</span>
                   <span className="font-bold text-gray-700">{new Date(profile?.created_at || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                </div>
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100/50 flex items-start gap-4">
         <Shield className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
         <div>
            <h5 className="font-black text-amber-800 text-sm uppercase tracking-tight">Security Protocol</h5>
            <p className="text-xs font-medium text-amber-700/70 mt-1 leading-relaxed">
               As an administrator, you have full write access to the entire institute database. 
               Ensure your session is closed before leaving shared workstations.
            </p>
         </div>
      </div>
    </div>
  );
};

export default AdminProfile;
