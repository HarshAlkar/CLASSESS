
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'faculty', 'student');
CREATE TYPE public.account_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.medium_type AS ENUM ('English', 'Marathi');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  requested_role public.app_role NOT NULL DEFAULT 'student',
  status public.account_status NOT NULL DEFAULT 'pending',
  medium public.medium_type,
  standard TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles (separate, secure)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- get profile status
CREATE OR REPLACE FUNCTION public.get_my_status()
RETURNS public.account_status
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status FROM public.profiles WHERE id = auth.uid()
$$;

-- Profiles policies
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Faculty view approved students" ON public.profiles
  FOR SELECT USING (
    public.has_role(auth.uid(), 'faculty')
    AND requested_role = 'student'
    AND status = 'approved'
  );
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins update profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own non-status fields" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- user_roles policies
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, requested_role, medium, standard)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'requested_role')::public.app_role, 'student'),
    NULLIF(NEW.raw_user_meta_data->>'medium','')::public.medium_type,
    NEW.raw_user_meta_data->>'standard'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Approval trigger: when profile status flips to 'approved', grant the requested role
CREATE OR REPLACE FUNCTION public.handle_approval()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, NEW.requested_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_approved
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_approval();

-- Announcements
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read announcements" ON public.announcements
  FOR SELECT USING (true);
CREATE POLICY "Admins manage announcements" ON public.announcements
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Enquiries (contact form)
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  standard TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit enquiry" ON public.enquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read enquiries" ON public.enquiries
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_announcements_updated BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed announcements
INSERT INTO public.announcements (title, description) VALUES
  ('Unit Test Schedule Released', 'The unit test schedule for all standards has been published. Please collect a printed copy from the office or check with your class teacher.'),
  ('Parent Meeting', 'Parent-teacher meeting will be held on the upcoming Saturday from 10:00 AM to 1:00 PM. Attendance is mandatory.'),
  ('New Study Material', 'Updated study material for Standards 8, 9 and 10 (English & Marathi medium) is now available at the institute.');
