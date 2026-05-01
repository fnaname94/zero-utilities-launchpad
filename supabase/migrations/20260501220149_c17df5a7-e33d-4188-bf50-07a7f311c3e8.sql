
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.vehicle_category AS ENUM ('van', 'furgao', 'caminhao', 'pickup', 'escolar', 'outro');
CREATE TYPE public.vehicle_status AS ENUM ('ativo', 'vendido', 'rascunho');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ VEHICLES ============
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT,
  price NUMERIC(12,2),
  km INTEGER DEFAULT 0,
  description TEXT,
  category public.vehicle_category NOT NULL DEFAULT 'van',
  fuel TEXT,
  transmission TEXT,
  engine TEXT,
  seats INTEGER,
  features TEXT[],
  cover_image TEXT,
  status public.vehicle_status NOT NULL DEFAULT 'ativo',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active vehicles"
  ON public.vehicles FOR SELECT
  USING (status = 'ativo' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert vehicles"
  ON public.vehicles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update vehicles"
  ON public.vehicles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete vehicles"
  ON public.vehicles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============ VEHICLE PHOTOS ============
CREATE TABLE public.vehicle_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicle_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vehicle photos"
  ON public.vehicle_photos FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage photos"
  ON public.vehicle_photos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ TRIGGERS ============
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER vehicles_set_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-photos', 'vehicle-photos', true);

CREATE POLICY "Public can view vehicle photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-photos');

CREATE POLICY "Admins can upload vehicle photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'vehicle-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update vehicle photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'vehicle-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete vehicle photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'vehicle-photos' AND public.has_role(auth.uid(), 'admin'));
