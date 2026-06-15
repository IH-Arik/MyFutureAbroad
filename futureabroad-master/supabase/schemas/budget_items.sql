-- budget_items.sql
create table if not exists budget_items (
  id uuid default gen_random_uuid() primary key,
  budget_id uuid not null references budgets(id) on delete cascade,
  name text not null,
  cost numeric(12,2) not null default 0,
  category text,
  status boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_budget_items_budget on budget_items (budget_id);
