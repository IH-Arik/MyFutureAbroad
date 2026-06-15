-- Enable RLS and allow public read on service_countries join table
alter table if exists public.service_countries enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'service_countries' and policyname = 'Public can read service_countries') then
    execute $pol$
      create policy "Public can read service_countries"
        on public.service_countries for select
        using (true);
    $pol$;
  end if;
end$$;
