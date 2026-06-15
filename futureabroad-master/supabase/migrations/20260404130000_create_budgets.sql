-- Migration: create budgets and budget_items tables
begin;

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  total_amount numeric(12,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.budget_items (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  name text not null,
  cost numeric(12,2) not null default 0,
  category text,
  status boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_budgets_user on public.budgets (user_id);
create index if not exists idx_budget_items_budget on public.budget_items (budget_id);

-- Grants similar to other tables
grant select on table public.budgets to anon;
grant insert on table public.budgets to anon;
grant update on table public.budgets to anon;
grant delete on table public.budgets to anon;

grant select on table public.budget_items to anon;
grant insert on table public.budget_items to anon;
grant update on table public.budget_items to anon;
grant delete on table public.budget_items to anon;

commit;
