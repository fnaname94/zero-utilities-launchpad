
-- Seed Vehicles
DO $$
DECLARE
  v_transit_id UUID;
  v_sprinter_id UUID;
  v_pajero_id UUID;
BEGIN
  -- 1. Ford Transit
  INSERT INTO public.vehicles (brand, model, year, price, km, category, fuel, transmission, cover_image, status, featured, description)
  VALUES (
    'Ford', 'Transit 350L Executivo', 2013, 109900.00, 0, 'van', 'Diesel', 'Manual',
    'https://zeroutilitarios.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-25-at-10.45.49.jpeg',
    'ativo', true, 'Ford Transit 350L Executivo em excelente estado.'
  ) RETURNING id INTO v_transit_id;

  INSERT INTO public.vehicle_photos (vehicle_id, url, position) VALUES
  (v_transit_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-25-at-10.45.49.jpeg', 0),
  (v_transit_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-25-at-10.45.50.jpeg', 1),
  (v_transit_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-25-at-10.45.50-1.jpeg', 2);

  -- 2. Mercedes Sprinter
  INSERT INTO public.vehicles (brand, model, year, price, km, category, fuel, transmission, cover_image, status, featured, description)
  VALUES (
    'Mercedes-Benz', 'Sprinter 415 Escolar', 2018, 194900.00, 0, 'escolar', 'Diesel', 'Manual',
    'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.16.17.jpeg',
    'ativo', true, 'Mercedes Sprinter 415 Escolar, pronta para trabalhar.'
  ) RETURNING id INTO v_sprinter_id;

  INSERT INTO public.vehicle_photos (vehicle_id, url, position) VALUES
  (v_sprinter_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.16.17.jpeg', 0),
  (v_sprinter_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.16.17-1.jpeg', 1),
  (v_sprinter_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-15.16.18.jpeg', 2);

  -- 3. Mitsubishi Pajero
  INSERT INTO public.vehicles (brand, model, year, price, km, category, fuel, transmission, cover_image, status, featured, description)
  VALUES (
    'Mitsubishi', 'Pajero Sport HPE', 2009, 56900.00, 0, 'outro', 'Diesel', 'Automático',
    'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.33.07.jpeg',
    'ativo', true, 'Mitsubishi Pajero Sport HPE em ótimo estado de conservação.'
  ) RETURNING id INTO v_pajero_id;

  INSERT INTO public.vehicle_photos (vehicle_id, url, position) VALUES
  (v_pajero_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.33.07.jpeg', 0),
  (v_pajero_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.33.09.jpeg', 1),
  (v_pajero_id, 'https://zeroutilitarios.com.br/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-09-at-14.33.09-1.jpeg', 2);
END $$;
