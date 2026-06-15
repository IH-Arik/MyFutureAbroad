-- Allow multiple orders per message thread
-- Remove the UNIQUE constraint on order_id to support multiple payment requests in one conversation

alter table public.message_threads
drop constraint if exists message_threads_order_id_key;
