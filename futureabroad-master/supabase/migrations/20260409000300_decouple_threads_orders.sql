-- 1. Add reference columns
ALTER TABLE public.orders ADD COLUMN thread_id UUID REFERENCES public.message_threads(id) ON DELETE CASCADE;
ALTER TABLE public.message_threads ADD COLUMN service_id UUID REFERENCES public.services(id) ON DELETE CASCADE;

-- 2. Migrate existing data
DO $$
BEGIN
  -- A thread's service_id is the same as its origin order's service_id
  UPDATE public.message_threads mt
  SET service_id = o.service_id 
  FROM public.orders o
  WHERE mt.order_id = o.id;

  -- An order's thread_id is the thread that points to it
  UPDATE public.orders o
  SET thread_id = mt.id 
  FROM public.message_threads mt
  WHERE mt.order_id = o.id;
END $$;

-- Drop rows where service_id is somehow still null because order didn't exist
DELETE FROM public.message_threads WHERE service_id IS NULL;

-- Make it NOT NULL for future
ALTER TABLE public.message_threads ALTER COLUMN service_id SET NOT NULL;

-- 3. Drop old trigger and column
DROP TRIGGER IF EXISTS on_order_created ON public.orders;
DROP FUNCTION IF EXISTS public.handle_new_order();

-- Wait, messages also have a thread_id foreign key. We need to be careful with dropping message_threads columns if views depend on them.
ALTER TABLE public.message_threads DROP COLUMN IF EXISTS order_id;

-- 4. Enable RLS for insert on message_threads (clients can start a chat)
CREATE POLICY "Clients can create message threads"
  ON public.message_threads FOR INSERT
  WITH CHECK (auth.uid() = client_id);
