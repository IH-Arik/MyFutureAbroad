-- Enable Row Level Security for visas
ALTER TABLE IF EXISTS public.visas ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to replace it cleanly
DROP POLICY IF EXISTS "Public can read visas" ON public.visas;

-- Allow anyone (public/anon) to read the visas
CREATE POLICY "Public can read visas"
    ON public.visas
    FOR SELECT
    USING (true);

-- Drop existing service role policies if they exist
DROP POLICY IF EXISTS "Service role can insert visas" ON public.visas;
DROP POLICY IF EXISTS "Service role can update visas" ON public.visas;
DROP POLICY IF EXISTS "Service role can delete visas" ON public.visas;

-- Allow service_role to manage visas (Note: service_role bypasses RLS anyway, 
-- but explicitly defining it can be good practice for admin dashboards)
CREATE POLICY "Service role can insert visas"
    ON public.visas
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update visas"
    ON public.visas
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role can delete visas"
    ON public.visas
    FOR DELETE
    USING (true);
