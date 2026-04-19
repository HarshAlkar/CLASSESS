import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, User } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  standard?: string;
  medium?: string;
  status: string;
}

const Students = () => {
  const [items, setItems] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("requested_role", "student")
        .order("full_name");
      setItems((data as Profile[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = items.filter(
    (i) =>
      i.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      i.standard?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Directory</h2>
          <p className="text-sm text-gray-500 mt-1">View list of all enrolled students.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by name or class..." 
            className="pl-10 h-10 border-gray-200" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-gray-100">
                <TableHead className="font-semibold text-gray-600">Student Name</TableHead>
                <TableHead className="font-semibold text-gray-600">Class</TableHead>
                <TableHead className="font-semibold text-gray-600">Medium</TableHead>
                <TableHead className="font-semibold text-gray-600">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">Loading directory...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">No students found matching your search.</TableCell></TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id} className="border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {s.full_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-none">{s.full_name}</p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{s.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 font-medium">{s.standard}</TableCell>
                    <TableCell className="text-sm text-gray-600 font-medium">{s.medium}</TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "font-medium px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider",
                        s.status === 'approved' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      )}>
                        {s.status}
                      </Badge>
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

import { cn } from "@/lib/utils";

export default Students;
