-- AI Backend tables: content_cache, chat_sessions, chat_messages
-- Run this in Supabase SQL Editor once to migrate from local PostgreSQL to Supabase

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Content Cache (stores Gemini AI responses with TTL to avoid repeated API calls)
CREATE TABLE IF NOT EXISTS content_cache (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key   varchar(255) NOT NULL UNIQUE,
  content_json text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_content_cache_expires_at ON content_cache (expires_at);

-- Chat Sessions (one session per user conversation with the AI)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature    varchar(50) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Chat Messages (individual messages in each session)
CREATE TABLE IF NOT EXISTS chat_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role       varchar(20) NOT NULL,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_chat_messages_session_id ON chat_messages (session_id);
