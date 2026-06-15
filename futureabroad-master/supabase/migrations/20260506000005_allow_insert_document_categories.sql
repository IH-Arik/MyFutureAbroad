-- Allow any authenticated user to insert new document categories

begin;

create policy "Authenticated users can create categories"
  on public.document_categories for insert
  with check (auth.role() = 'authenticated');

commit;
