-- Allow authenticated users to update and delete document categories
-- so they can manage their own custom categories in the modal

begin;

create policy "Authenticated users can update categories"
  on public.document_categories for update
  using (true)
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete categories"
  on public.document_categories for delete
  using (auth.role() = 'authenticated');

commit;
