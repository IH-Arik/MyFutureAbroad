-- Migration: enable RLS and policies for budgets and budget_items

alter table if exists public.budgets enable row level security;
alter table if exists public.budget_items enable row level security;

-- Budgets policies
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budgets' and policyname = 'Users can view own budgets') then
    execute $pol$
      create policy "Users can view own budgets"
        on public.budgets for select
        using (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budgets' and policyname = 'Users can insert budgets') then
    execute $pol$
      create policy "Users can insert budgets"
        on public.budgets for insert
        with check (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budgets' and policyname = 'Users can update own budgets') then
    execute $pol$
      create policy "Users can update own budgets"
        on public.budgets for update
        using (auth.uid() = user_id)
        with check (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budgets' and policyname = 'Users can delete own budgets') then
    execute $pol$
      create policy "Users can delete own budgets"
        on public.budgets for delete
        using (auth.uid() = user_id);
    $pol$;
  end if;
end$$;

-- Budget items policies (allow access only if the parent budget belongs to the user)
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budget_items' and policyname = 'Users can view budget items for their budgets') then
    execute $pol$
      create policy "Users can view budget items for their budgets"
        on public.budget_items for select
        using (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        );
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budget_items' and policyname = 'Users can insert budget items for their budgets') then
    execute $pol$
      create policy "Users can insert budget items for their budgets"
        on public.budget_items for insert
        with check (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        );
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budget_items' and policyname = 'Users can update budget items for their budgets') then
    execute $pol$
      create policy "Users can update budget items for their budgets"
        on public.budget_items for update
        using (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        )
        with check (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        );
    $pol$;
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'budget_items' and policyname = 'Users can delete budget items for their budgets') then
    execute $pol$
      create policy "Users can delete budget items for their budgets"
        on public.budget_items for delete
        using (
          exists (
            select 1 from public.budgets b
            where b.id = public.budget_items.budget_id
              and b.user_id = auth.uid()
          )
        );
    $pol$;
  end if;
end$$;
