-- Migration: add sort_order to checklist_items for drag-and-drop reordering
begin;

alter table if exists public.checklist_items
  add column if not exists sort_order int not null default 0;

-- Update existing rows so sort_order follows created_at order per checklist
with ranked as (
  select id, row_number() over (partition by checklist_id order by created_at asc) - 1 as rn
  from public.checklist_items
)
update public.checklist_items
set sort_order = ranked.rn
from ranked
where public.checklist_items.id = ranked.id;

commit;
