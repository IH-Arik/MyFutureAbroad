
  create table "public"."providers" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "company_name" text not null,
    "logo_url" text,
    "description" text,
    "provider_type" text,
    "countries_served" integer[],
    "languages" text[],
    "rating" numeric(3,2) default 0,
    "review_count" integer default 0,
    "verified" boolean default false,
    "response_time_hours" integer,
    "contact_email" text,
    "website" text,
    "status" text default 'active'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."service_types" (
    "id" text not null,
    "name" text not null,
    "icon" text,
    "tagline" text,
    "description" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."services" (
    "id" uuid not null default gen_random_uuid(),
    "provider_id" uuid not null,
    "title" text not null,
    "description" text,
    "service_type" text not null,
    "applicable_visas" integer[],
    "applicable_countries" integer[],
    "price_usd" numeric(12,2),
    "price_type" text,
    "delivery_days" integer,
    "includes" text[],
    "requirements" text[],
    "image_url" text,
    "active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


CREATE INDEX idx_providers_company_name ON public.providers USING btree (company_name);

CREATE INDEX idx_providers_type ON public.providers USING btree (provider_type);

CREATE INDEX idx_providers_verified ON public.providers USING btree (verified);

CREATE INDEX idx_services_price_usd ON public.services USING btree (price_usd);

CREATE INDEX idx_services_provider ON public.services USING btree (provider_id);

CREATE INDEX idx_services_type ON public.services USING btree (service_type);

CREATE UNIQUE INDEX providers_pkey ON public.providers USING btree (id);

CREATE UNIQUE INDEX service_types_pkey ON public.service_types USING btree (id);

CREATE UNIQUE INDEX services_pkey ON public.services USING btree (id);

alter table "public"."providers" add constraint "providers_pkey" PRIMARY KEY using index "providers_pkey";

alter table "public"."service_types" add constraint "service_types_pkey" PRIMARY KEY using index "service_types_pkey";

alter table "public"."services" add constraint "services_pkey" PRIMARY KEY using index "services_pkey";

alter table "public"."providers" add constraint "providers_provider_type_check" CHECK ((provider_type = ANY (ARRAY['agency'::text, 'law_firm'::text, 'freelancer'::text, 'consultancy'::text]))) not valid;

alter table "public"."providers" validate constraint "providers_provider_type_check";

alter table "public"."providers" add constraint "providers_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'pending'::text, 'suspended'::text]))) not valid;

alter table "public"."providers" validate constraint "providers_status_check";

alter table "public"."services" add constraint "services_price_type_check" CHECK ((price_type = ANY (ARRAY['fixed'::text, 'starting_at'::text, 'hourly'::text]))) not valid;

alter table "public"."services" validate constraint "services_price_type_check";

alter table "public"."services" add constraint "services_price_usd_check" CHECK ((price_usd >= (0)::numeric)) not valid;

alter table "public"."services" validate constraint "services_price_usd_check";

alter table "public"."services" add constraint "services_provider_id_fkey" FOREIGN KEY (provider_id) REFERENCES public.providers(id) ON DELETE CASCADE not valid;

alter table "public"."services" validate constraint "services_provider_id_fkey";

alter table "public"."services" add constraint "services_service_type_fkey" FOREIGN KEY (service_type) REFERENCES public.service_types(id) not valid;

alter table "public"."services" validate constraint "services_service_type_fkey";

grant delete on table "public"."providers" to "anon";

grant insert on table "public"."providers" to "anon";

grant references on table "public"."providers" to "anon";

grant select on table "public"."providers" to "anon";

grant trigger on table "public"."providers" to "anon";

grant truncate on table "public"."providers" to "anon";

grant update on table "public"."providers" to "anon";

grant delete on table "public"."providers" to "authenticated";

grant insert on table "public"."providers" to "authenticated";

grant references on table "public"."providers" to "authenticated";

grant select on table "public"."providers" to "authenticated";

grant trigger on table "public"."providers" to "authenticated";

grant truncate on table "public"."providers" to "authenticated";

grant update on table "public"."providers" to "authenticated";

grant delete on table "public"."providers" to "service_role";

grant insert on table "public"."providers" to "service_role";

grant references on table "public"."providers" to "service_role";

grant select on table "public"."providers" to "service_role";

grant trigger on table "public"."providers" to "service_role";

grant truncate on table "public"."providers" to "service_role";

grant update on table "public"."providers" to "service_role";

grant delete on table "public"."service_types" to "anon";

grant insert on table "public"."service_types" to "anon";

grant references on table "public"."service_types" to "anon";

grant select on table "public"."service_types" to "anon";

grant trigger on table "public"."service_types" to "anon";

grant truncate on table "public"."service_types" to "anon";

grant update on table "public"."service_types" to "anon";

grant delete on table "public"."service_types" to "authenticated";

grant insert on table "public"."service_types" to "authenticated";

grant references on table "public"."service_types" to "authenticated";

grant select on table "public"."service_types" to "authenticated";

grant trigger on table "public"."service_types" to "authenticated";

grant truncate on table "public"."service_types" to "authenticated";

grant update on table "public"."service_types" to "authenticated";

grant delete on table "public"."service_types" to "service_role";

grant insert on table "public"."service_types" to "service_role";

grant references on table "public"."service_types" to "service_role";

grant select on table "public"."service_types" to "service_role";

grant trigger on table "public"."service_types" to "service_role";

grant truncate on table "public"."service_types" to "service_role";

grant update on table "public"."service_types" to "service_role";

grant delete on table "public"."services" to "anon";

grant insert on table "public"."services" to "anon";

grant references on table "public"."services" to "anon";

grant select on table "public"."services" to "anon";

grant trigger on table "public"."services" to "anon";

grant truncate on table "public"."services" to "anon";

grant update on table "public"."services" to "anon";

grant delete on table "public"."services" to "authenticated";

grant insert on table "public"."services" to "authenticated";

grant references on table "public"."services" to "authenticated";

grant select on table "public"."services" to "authenticated";

grant trigger on table "public"."services" to "authenticated";

grant truncate on table "public"."services" to "authenticated";

grant update on table "public"."services" to "authenticated";

grant delete on table "public"."services" to "service_role";

grant insert on table "public"."services" to "service_role";

grant references on table "public"."services" to "service_role";

grant select on table "public"."services" to "service_role";

grant trigger on table "public"."services" to "service_role";

grant truncate on table "public"."services" to "service_role";

grant update on table "public"."services" to "service_role";


