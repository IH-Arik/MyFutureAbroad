-- Improve handle_new_user trigger to capture full_name and date_of_birth from auth metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, date_of_birth)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role'), 'client'),
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'date_of_birth')::date
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      date_of_birth = excluded.date_of_birth,
      role = excluded.role;
  return new;
end;
$$;
