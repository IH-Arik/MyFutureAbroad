-- Migration: AI Chat sessions and messages

begin;

create table if not exists public.ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null default 'New Chat',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ai_chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'tool')),
  content text not null,
  tool_calls jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_ai_chat_sessions_user on public.ai_chat_sessions (user_id);
create index if not exists idx_ai_chat_messages_session on public.ai_chat_messages (session_id);

-- RLS
alter table public.ai_chat_sessions enable row level security;
alter table public.ai_chat_messages enable row level security;

create policy "Users can manage own sessions"
  on public.ai_chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own messages"
  on public.ai_chat_messages for all
  using (
    session_id in (
      select id from public.ai_chat_sessions where user_id = auth.uid()
    )
  )
  with check (
    session_id in (
      select id from public.ai_chat_sessions where user_id = auth.uid()
    )
  );

-- Grants
grant select, insert, update, delete on public.ai_chat_sessions to anon, authenticated;
grant select, insert, update, delete on public.ai_chat_messages to anon, authenticated;

commit;
