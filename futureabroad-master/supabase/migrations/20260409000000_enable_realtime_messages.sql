-- Enable realtime on messages and message_threads tables
-- This allows changes to these tables to be broadcast to subscribed clients in real-time

BEGIN;

-- Add messages table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Add message_threads table to realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE message_threads;

COMMIT;
