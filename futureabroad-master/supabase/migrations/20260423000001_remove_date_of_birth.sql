-- Remove date_of_birth from profiles and update the new-user trigger

ALTER TABLE public.profiles DROP COLUMN IF EXISTS date_of_birth;

-- Update trigger to no longer insert/upsert date_of_birth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'role'), 'client'),
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;
  RETURN NEW;
END;
$$;
