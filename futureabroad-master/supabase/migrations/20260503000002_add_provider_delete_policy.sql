-- Add RLS policy to allow provider owners to delete their own providers
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'providers' and policyname = 'Provider owners can delete their own providers') then
    execute $pol$
      create policy "Provider owners can delete their own providers"
        on public.providers for delete
        using (
          exists (
            select 1 from public.provider_members
            where provider_members.provider_id = providers.id
            and provider_members.user_id = auth.uid()
            and provider_members.role = 'owner'
          )
        );
    $pol$;
  end if;
end$$;

