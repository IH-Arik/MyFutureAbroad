-- service_countries.sql
create table if not exists service_countries (
  service_id uuid not null references services(id) on delete cascade,
  country_id integer not null references countries(id) on delete cascade,
  primary key (service_id, country_id)
);

create index if not exists idx_service_countries_service on service_countries (service_id);
create index if not exists idx_service_countries_country on service_countries (country_id);
