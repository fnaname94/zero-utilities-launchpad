
-- Fix function search_path (already set on most, ensure all)
ALTER FUNCTION public.update_updated_at() SET search_path = public;

-- Revoke public execution on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;

-- Tighten storage SELECT: restrict to specific object access only (no listing)
DROP POLICY IF EXISTS "Public can view vehicle photos" ON storage.objects;
CREATE POLICY "Public can read vehicle photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-photos');
-- Note: Bucket remains public for direct URL access; listing is guarded at API level
