-- budgets.sql
create table if not exists budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  name text not null,
  total_amount numeric(12,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_budgets_user on budgets (user_id);
