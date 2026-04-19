# 🎓 Shree Classes ERP Portal

A modern, professional institute management system designed for **Shree Classes**, providing a seamless experience for Students, Faculty, and Administrators.

![Project Preview](https://classess-ten.vercel.app/og-image.png)

## 🚀 Live Demo
Check out the live application: [Shree Classes ERP](https://classess-ten.vercel.app)

---

## ✨ Features

### 🏛️ For Administrators
- **User Approvals**: Review and approve student/faculty registration requests.
- **Unified Management**: Manage all academy data from a central dashboard.
- **Announcements**: Post real-time updates for all users.
- **Enquiry Tracking**: Manage lead enquiries from the public contact form.

### 👨‍🏫 For Faculty
- **Attendance Management**: Mark and track student attendance digitally.
- **Course Materials**: Upload and organize study materials.
- **Lecture Scheduling**: Manage upcoming lectures and topics.
- **Homework Assignment**: Assign and track homework for different standards.

### 📖 For Students
- **Personal Dashboard**: View daily schedules and progress.
- **Homework & Materials**: Access assigned tasks and study resources anytime.
- **Attendance Tracking**: Monitor personal attendance records.
- **Notices**: Stay updated with the latest academy announcements.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Role-based)
- **Deployment**: Vercel

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/HarshAlkar/CLASSESS.git
cd CLASSESS
```

### 2. Install dependencies
```bash
npm install
# or
bun install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

### 4. Database Setup
Run the SQL migrations provided in the `/supabase/migrations` folder using the Supabase SQL Editor to set up tables, enums, and triggers.

### 5. Run locally
```bash
npm run dev
```

---

## 🔑 Access Credentials (Dev Mode)

For testing purposes, the following backdoor accounts are available:

- **Super Admin**: `admin@shreeclasses.com` / `admin123`
- **Master Faculty**: `faculty@shreeclasses.com` / `faculty123`

---

## 📄 License
This project is for internal use at Shree Classes.

Developed with ❤️ by **Harsh Alkar**.
