-- Fix: allow provider deletion without destroying chat history.
-- The message_threads FK was ON DELETE CASCADE — deleting a provider
-- would wipe all threads and their messages. Change to SET NULL instead.
ALTER TABLE public.message_threads
  ALTER COLUMN provider_id DROP NOT NULL;

ALTER TABLE public.message_threads
  DROP CONSTRAINT IF EXISTS message_threads_provider_id_fkey;

ALTER TABLE public.message_threads
  ADD CONSTRAINT message_threads_provider_id_fkey
  FOREIGN KEY (provider_id) REFERENCES public.providers(id) ON DELETE SET NULL;
