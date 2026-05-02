-- ============ ENUMS ============
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.vehicle_category AS ENUM ('van', 'furgao', 'caminhao', 'pickup', 'escolar', 'outro');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE public.vehicle_status AS ENUM ('ativo', 'vendido', 'rascunho');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by owner" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ============ USER ROLES ============
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ VEHICLES ============
CREATE TABLE IF NOT EXISTS public.vehicles (
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

DROP POLICY IF EXISTS "Anyone can view active vehicles" ON public.vehicles;
CREATE POLICY "Anyone can view active vehicles" ON public.vehicles FOR SELECT USING (status = 'ativo' OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert vehicles" ON public.vehicles;
CREATE POLICY "Admins can insert vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update vehicles" ON public.vehicles;
CREATE POLICY "Admins can update vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete vehicles" ON public.vehicles;
CREATE POLICY "Admins can delete vehicles" ON public.vehicles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ VEHICLE PHOTOS ============
CREATE TABLE IF NOT EXISTS public.vehicle_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicle_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view vehicle photos" ON public.vehicle_photos;
CREATE POLICY "Anyone can view vehicle photos" ON public.vehicle_photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage photos" ON public.vehicle_photos;
CREATE POLICY "Admins can manage photos" ON public.vehicle_photos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ TRIGGERS & FUNCTIONS ============
CREATE OR REPLACE FUNCTION public.update_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS vehicles_set_updated_at ON public.vehicles;
CREATE TRIGGER vehicles_set_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ SECURITY DEFINER PERMISSIONS ============
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-photos', 'vehicle-photos', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Public can read vehicle photos" ON storage.objects;
CREATE POLICY "Public can read vehicle photos" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-photos');

DROP POLICY IF EXISTS "Admins can upload vehicle photos" ON storage.objects;
CREATE POLICY "Admins can upload vehicle photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vehicle-photos' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update vehicle photos" ON storage.objects;
CREATE POLICY "Admins can update vehicle photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'vehicle-photos' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete vehicle photos" ON storage.objects;
CREATE POLICY "Admins can delete vehicle photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'vehicle-photos' AND public.has_role(auth.uid(), 'admin'));

-- ============ SEED VEHICLES ============
DO $$
DECLARE
  v_transit_id UUID; v_sprinter_id UUID; v_pajero_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.vehicles WHERE model = 'Transit 350L Executivo') THEN
      INSERT INTO public.vehicles (brand, model, year, price, km, category, fuel, transmission, cover_image, status, featured, description)
      VALUES ('Ford', 'Transit 350L Executivo', 2013, 109900.00, 0, 'van', 'Diesel', 'Manual', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-25-at-10.45.49.jpeg', 'ativo', true, 'Ford Transit 350L Executivo em excelente estado.') RETURNING id INTO v_transit_id;

      INSERT INTO public.vehicle_photos (vehicle_id, url, position) VALUES
      (v_transit_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-25-at-10.45.49.jpeg', 0),
      (v_transit_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-25-at-10.45.50.jpeg', 1),
      (v_transit_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-25-at-10.45.50-1.jpeg', 2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.vehicles WHERE model = 'Sprinter 415 Escolar') THEN
      INSERT INTO public.vehicles (brand, model, year, price, km, category, fuel, transmission, cover_image, status, featured, description)
      VALUES ('Mercedes-Benz', 'Sprinter 415 Escolar', 2018, 194900.00, 0, 'escolar', 'Diesel', 'Manual', 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.16.17.jpeg', 'ativo', true, 'Mercedes Sprinter 415 Escolar, pronta para trabalhar.') RETURNING id INTO v_sprinter_id;

      INSERT INTO public.vehicle_photos (vehicle_id, url, position) VALUES
      (v_sprinter_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.16.17.jpeg', 0),
      (v_sprinter_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.16.17-1.jpeg', 1),
      (v_sprinter_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.16.18.jpeg', 2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.vehicles WHERE model = 'Pajero Sport HPE') THEN
      INSERT INTO public.vehicles (brand, model, year, price, km, category, fuel, transmission, cover_image, status, featured, description)
      VALUES ('Mitsubishi', 'Pajero Sport HPE', 2009, 56900.00, 0, 'outro', 'Diesel', 'Automático', 'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.33.07.jpeg', 'ativo', true, 'Mitsubishi Pajero Sport HPE em ótimo estado de conservação.') RETURNING id INTO v_pajero_id;

      INSERT INTO public.vehicle_photos (vehicle_id, url, position) VALUES
      (v_pajero_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.33.07.jpeg', 0),
      (v_pajero_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.33.09.jpeg', 1),
      (v_pajero_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.33.09-1.jpeg', 2);
  END IF;
END $$;

-- Dar admin para quem já criou conta
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
ON CONFLICT DO NOTHING;
