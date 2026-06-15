import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supaUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supaUrl, serviceRoleKey);

const SQL = `
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

alter table public.ai_chat_sessions enable row level security;
alter table public.ai_chat_messages enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'ai_chat_sessions' and policyname = 'Users can manage own sessions'
  ) then
    create policy "Users can manage own sessions"
      on public.ai_chat_sessions for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'ai_chat_messages' and policyname = 'Users can manage own messages'
  ) then
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
  end if;
end $$;

grant select, insert, update, delete on public.ai_chat_sessions to anon, authenticated;
grant select, insert, update, delete on public.ai_chat_messages to anon, authenticated;
`;

async function runMigration() {
  console.log('Running migration against Supabase...');
  
  // Use Supabase REST API to execute raw SQL via rpc or direct postgres endpoint
  const res = await fetch(`${supaUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql: SQL })
  });
  
  if (res.ok) {
    console.log('Migration succeeded via rpc/exec_sql!');
    return;
  }
  
  const errText = await res.text();
  console.log('exec_sql not available, trying pg endpoint...', res.status, errText.slice(0, 200));

  // Try the pg endpoint (available in some setups)
  const pgRes = await fetch(`${supaUrl}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: SQL })
  });

  if (pgRes.ok) {
    console.log('Migration succeeded via /pg/query!');
    return;
  }

  console.log('pg/query also failed:', pgRes.status, (await pgRes.text()).slice(0, 200));
  console.log('\nNeeds manual execution. Copy the SQL from the migration file and run it in Supabase SQL Editor.');
}

runMigration();
