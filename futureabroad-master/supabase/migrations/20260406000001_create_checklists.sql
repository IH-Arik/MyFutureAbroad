-- Migration: create checklists and checklist_items tables with RLS
begin;

create table if not exists public.checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references public.checklists(id) on delete cascade,
  name text not null,
  category text,
  status boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_checklists_user on public.checklists (user_id);
create index if not exists idx_checklist_items_checklist on public.checklist_items (checklist_id);

-- Grants
grant select on table public.checklists to anon;
grant insert on table public.checklists to anon;
grant update on table public.checklists to anon;
grant delete on table public.checklists to anon;

grant select on table public.checklist_items to anon;
grant insert on table public.checklist_items to anon;
grant update on table public.checklist_items to anon;
grant delete on table public.checklist_items to anon;

-- RLS
alter table if exists public.checklists enable row level security;
alter table if exists public.checklist_items enable row level security;

-- Checklists policies
create policy "Users can view own checklists" on public.checklists for select using (auth.uid() = user_id);
create policy "Users can insert checklists" on public.checklists for insert with check (auth.uid() = user_id);
create policy "Users can update own checklists" on public.checklists for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete own checklists" on public.checklists for delete using (auth.uid() = user_id);

-- Checklist items policies
create policy "Users can view checklist items for their checklists" on public.checklist_items for select using (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid()));
create policy "Users can insert checklist items for their checklists" on public.checklist_items for insert with check (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid()));
create policy "Users can update checklist items for their checklists" on public.checklist_items for update using (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid())) with check (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid()));
create policy "Users can delete checklist items for their checklists" on public.checklist_items for delete using (exists (select 1 from public.checklists c where c.id = public.checklist_items.checklist_id and c.user_id = auth.uid()));

commit;