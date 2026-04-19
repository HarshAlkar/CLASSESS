import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import PublicLayout from "@/components/layout/PublicLayout";
import RequireRole from "@/components/RequireRole";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Announcements from "./pages/Announcements";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import StudentLayout from "@/components/layout/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import Attendance from "./pages/student/Attendance";
import Homework from "./pages/student/Homework";
import Lectures from "./pages/student/Lectures";
import Materials from "./pages/student/Materials";
import Notices from "./pages/student/Notices";
import Profile from "./pages/student/Profile";
import FacultyLayout from "@/components/layout/FacultyLayout";
import FacultyDashboard from "./pages/faculty/Dashboard";
import FacultyStudents from "./pages/faculty/Students";
import FacultyAttendance from "./pages/faculty/Attendance";
import FacultyHomework from "./pages/faculty/Homework";
import FacultyLectures from "./pages/faculty/Lectures";
import FacultyMaterials from "./pages/faculty/Materials";
import FacultyNotices from "./pages/faculty/Notices";
import FacultyProfile from "./pages/faculty/Profile";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminApprovals from "./pages/admin/Approvals";
import AdminStudents from "./pages/admin/Students";
import AdminFaculty from "./pages/admin/Faculty";
import AdminAttendance from "./pages/admin/Attendance";
import AdminHomework from "./pages/admin/Homework";
import AdminLectures from "./pages/admin/Lectures";
import AdminMaterials from "./pages/admin/Materials";
import AdminAnnouncements from "./pages/admin/Announcements";
import AdminEnquiries from "./pages/admin/Enquiries";
import AdminProfile from "./pages/admin/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/about" element={<About />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Professional Student Dashboard Routes */}
            <Route path="/student" element={<RequireRole role="student"><StudentLayout /></RequireRole>}>
              <Route index element={<StudentDashboard />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="homework" element={<Homework />} />
              <Route path="lectures" element={<Lectures />} />
              <Route path="materials" element={<Materials />} />
              <Route path="notices" element={<Notices />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Professional Faculty Dashboard Routes */}
            <Route path="/faculty" element={<RequireRole role="faculty"><FacultyLayout /></RequireRole>}>
              <Route index element={<FacultyDashboard />} />
              <Route path="students" element={<FacultyStudents />} />
              <Route path="attendance" element={<FacultyAttendance />} />
              <Route path="homework" element={<FacultyHomework />} />
              <Route path="lectures" element={<FacultyLectures />} />
              <Route path="materials" element={<FacultyMaterials />} />
              <Route path="notices" element={<FacultyNotices />} />
              <Route path="profile" element={<FacultyProfile />} />
            </Route>

            {/* Professional Admin Dashboard Routes */}
            <Route path="/admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
              <Route index element={<AdminDashboard />} />
              <Route path="approvals" element={<AdminApprovals />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="faculty" element={<AdminFaculty />} />
              <Route path="attendance" element={<AdminAttendance />} />
              <Route path="homework" element={<AdminHomework />} />
              <Route path="lectures" element={<AdminLectures />} />
              <Route path="materials" element={<AdminMaterials />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
