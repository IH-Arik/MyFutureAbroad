-- Update handle_new_user trigger to respect the role passed in user metadata.
-- This avoids needing a client-side upsert (which hits RLS) for provider signups.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  _role text;
begin
  _role := coalesce(new.raw_user_meta_data->>'role', 'client');
  -- Sanitise: only allow known roles
  if _role not in ('client', 'provider') then
    _role := 'client';
  end if;

  insert into public.profiles (id, role)
  values (new.id, _role)
  on conflict (id) do update set role = excluded.role;

  return new;
end;
$$;
