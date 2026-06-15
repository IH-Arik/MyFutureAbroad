-- ============================================================
-- PROFILES
-- One row per auth user. role = 'client' | 'provider'
-- provider_id links provider-role users to their provider row
-- ============================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text not null default 'client' check (role in ('client', 'provider')),
  provider_id  uuid references public.providers(id) on delete set null,
  full_name    text,
  avatar_url   text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Automatically create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'client')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- ============================================================
-- ORDERS
-- Created when a client books a service
-- ============================================================
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references auth.users(id) on delete cascade,
  service_id   uuid not null references public.services(id) on delete restrict,
  provider_id  uuid not null references public.providers(id) on delete restrict,
  status       text not null default 'pending'
                 check (status in ('pending', 'active', 'completed', 'cancelled')),
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists idx_orders_client    on public.orders(client_id);
create index if not exists idx_orders_provider  on public.orders(provider_id);
create index if not exists idx_orders_service   on public.orders(service_id);

alter table public.orders enable row level security;

create policy "Clients see their own orders"
  on public.orders for select
  using (auth.uid() = client_id);

create policy "Providers see orders for their provider"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and provider_id = public.orders.provider_id
    )
  );

create policy "Clients can create orders"
  on public.orders for insert
  with check (auth.uid() = client_id);

create policy "Providers can update order status"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and provider_id = public.orders.provider_id
    )
  );


-- ============================================================
-- MESSAGE THREADS
-- One thread per order (1-to-1 between order and thread)
-- ============================================================
create table if not exists public.message_threads (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null unique references public.orders(id) on delete cascade,
  client_id    uuid not null references auth.users(id) on delete cascade,
  provider_id  uuid not null references public.providers(id) on delete cascade,
  created_at   timestamptz default now()
);

create index if not exists idx_threads_client    on public.message_threads(client_id);
create index if not exists idx_threads_provider  on public.message_threads(provider_id);

alter table public.message_threads enable row level security;

create policy "Clients see their threads"
  on public.message_threads for select
  using (auth.uid() = client_id);

create policy "Providers see their threads"
  on public.message_threads for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and provider_id = public.message_threads.provider_id
    )
  );

-- Auto-create thread when order is inserted
create or replace function public.handle_new_order()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.message_threads (order_id, client_id, provider_id)
  values (new.id, new.client_id, new.provider_id);
  return new;
end;
$$;

drop trigger if exists on_order_created on public.orders;
create trigger on_order_created
  after insert on public.orders
  for each row execute procedure public.handle_new_order();


-- ============================================================
-- MESSAGES
-- Individual messages within a thread
-- sender_type: 'client' | 'provider'
-- ============================================================
create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  thread_id    uuid not null references public.message_threads(id) on delete cascade,
  sender_id    uuid not null references auth.users(id) on delete cascade,
  sender_type  text not null check (sender_type in ('client', 'provider')),
  body         text not null,
  created_at   timestamptz default now()
);

create index if not exists idx_messages_thread on public.messages(thread_id);
create index if not exists idx_messages_sender on public.messages(sender_id);

alter table public.messages enable row level security;

-- Client can read messages in their threads
create policy "Thread participants can read messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.message_threads t
      where t.id = public.messages.thread_id
        and (
          t.client_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid()
              and p.provider_id = t.provider_id
          )
        )
    )
  );

-- Any participant can insert a message
create policy "Thread participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.message_threads t
      where t.id = public.messages.thread_id
        and (
          t.client_id = auth.uid()
          or exists (
            select 1 from public.profiles p
            where p.id = auth.uid()
              and p.provider_id = t.provider_id
          )
        )
    )
  );
