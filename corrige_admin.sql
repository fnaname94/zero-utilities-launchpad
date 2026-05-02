DO $$ 
DECLARE 
  v_user_id UUID; 
BEGIN 
  -- Pega o ID da sua conta
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'fernandonaname@gmail.com' LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Garante que você existe na tabela de perfis
    INSERT INTO public.profiles (id, full_name) VALUES (v_user_id, 'Fernando') ON CONFLICT (id) DO NOTHING;
    
    -- Garante que você tem a permissão de admin
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
