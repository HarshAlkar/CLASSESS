import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { UserCheck, UserX, UserMinus, ShieldCheck, BookOpen, Clock } from "lucide-react";

interface Request {
  id: string;
  full_name: string;
  email: string;
  requested_role: string;
  standard: string;
  medium: string;
  status: string;
  created_at: string;
}

const Approvals = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    setRequests((data as Request[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: action })
      .eq("id", id);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`User successfully ${action}`);
      fetchRequests();
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-3xl font-black text-[#1B2B4E] tracking-tight">Access Control & Approvals</h2>
        <p className="text-gray-500 font-medium mt-1">Review and manage pending account requests for students and faculty.</p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden bg-white">
        <CardHeader className="bg-white border-b border-gray-100 py-4">
          <CardTitle className="text-base font-bold text-[#1B2B4E] flex items-center justify-between">
             <span>Pending Queue ({requests.length})</span>
             <Button variant="ghost" onClick={fetchRequests} disabled={loading} className="text-gray-400 hover:text-blue-600 transition-colors">
               <Clock className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
             </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-gray-100">
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-4">User Details</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-4 text-center">Role Requested</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-4 text-center">Class / Group</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-4 text-center">Medium</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-400 py-4 text-right">Decision</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">Processing requests...</TableCell></TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                     <div className="flex flex-col items-center justify-center gap-3 grayscale opacity-30">
                        <UserCheck className="h-12 w-12" />
                        <p className="text-sm font-bold uppercase tracking-widest">Queue Clear</p>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{req.full_name}</span>
                        <span className="text-xs text-gray-400">{req.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={req.requested_role === 'faculty' ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50' : 'bg-blue-50 text-blue-700 hover:bg-blue-50'}>
                        {req.requested_role === 'faculty' ? <ShieldCheck className="h-3 w-3 mr-1" /> : <BookOpen className="h-3 w-3 mr-1" />}
                        {req.requested_role.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium text-gray-500 uppercase">{req.standard || 'N/A'}</TableCell>
                    <TableCell className="text-center text-sm font-medium text-gray-500 uppercase">{req.medium || 'N/A'}</TableCell>
                    <TableCell className="text-right py-4 pr-4">
                      <div className="flex items-center justify-end gap-2 text-right">
                        <Button 
                          onClick={() => handleAction(req.id, 'rejected')} 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                        >
                          <UserX className="h-4 w-4" /> Reject
                        </Button>
                        <Button 
                          onClick={() => handleAction(req.id, 'approved')} 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 flex items-center gap-1.5"
                        >
                          <UserCheck className="h-4 w-4" /> Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Approvals;
