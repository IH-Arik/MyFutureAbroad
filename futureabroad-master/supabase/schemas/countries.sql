-- countries.sql
create table if not exists countries (
  id serial primary key,
  continent text not null,
  name text not null,
  iso_code char(2),
  flag_url text,
  highlight_img_url text,
  created_at timestamptz default now()
);

create unique index if not exists idx_countries_name on countries (name);
