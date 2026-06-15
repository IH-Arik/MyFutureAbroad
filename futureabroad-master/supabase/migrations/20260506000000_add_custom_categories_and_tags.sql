-- Migration: add custom categories and tags for checklists
begin;

-- ==============================
-- Custom categories per user
-- ==============================
create table if not exists public.checklist_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique(user_id, name)
);

-- ==============================
-- Tags per user
-- ==============================
create table if not exists public.checklist_tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique(user_id, name)
);

-- ==============================
-- Junction: item <-> tag
-- ==============================
create table if not exists public.checklist_item_tags (
  checklist_item_id uuid not null references public.checklist_items(id) on delete cascade,
  tag_id uuid not null references public.checklist_tags(id) on delete cascade,
  primary key (checklist_item_id, tag_id)
);

-- Indexes
create index if not exists idx_checklist_categories_user on public.checklist_categories (user_id);
create index if not exists idx_checklist_tags_user on public.checklist_tags (user_id);
create index if not exists idx_checklist_item_tags_item on public.checklist_item_tags (checklist_item_id);
create index if not exists idx_checklist_item_tags_tag on public.checklist_item_tags (tag_id);

-- Grants
grant select, insert, update, delete on public.checklist_categories to anon;
grant select, insert, update, delete on public.checklist_tags to anon;
grant select, insert, update, delete on public.checklist_item_tags to anon;

-- ==============================
-- RLS
-- ==============================
alter table if exists public.checklist_categories enable row level security;
alter table if exists public.checklist_tags enable row level security;
alter table if exists public.checklist_item_tags enable row level security;

-- --- checklist_categories policies ---
create policy "Users can view own categories"
  on public.checklist_categories for select
  using (auth.uid() = user_id);

create policy "Users can insert categories"
  on public.checklist_categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own categories"
  on public.checklist_categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own categories"
  on public.checklist_categories for delete
  using (auth.uid() = user_id);

-- --- checklist_tags policies ---
create policy "Users can view own tags"
  on public.checklist_tags for select
  using (auth.uid() = user_id);

create policy "Users can insert tags"
  on public.checklist_tags for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tags"
  on public.checklist_tags for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own tags"
  on public.checklist_tags for delete
  using (auth.uid() = user_id);

-- --- checklist_item_tags policies (ownership via checklist) ---
create policy "Users can view item tags for their checklists"
  on public.checklist_item_tags for select
  using (
    exists (
      select 1 from public.checklist_items ci
      join public.checklists c on c.id = ci.checklist_id
      where ci.id = checklist_item_id and c.user_id = auth.uid()
    )
  );

create policy "Users can insert item tags for their checklists"
  on public.checklist_item_tags for insert
  with check (
    exists (
      select 1 from public.checklist_items ci
      join public.checklists c on c.id = ci.checklist_id
      where ci.id = checklist_item_id and c.user_id = auth.uid()
    )
  );

create policy "Users can delete item tags for their checklists"
  on public.checklist_item_tags for delete
  using (
    exists (
      select 1 from public.checklist_items ci
      join public.checklists c on c.id = ci.checklist_id
      where ci.id = checklist_item_id and c.user_id = auth.uid()
    )
  );

commit;
