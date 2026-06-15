create sequence "public"."countries_id_seq";

create sequence "public"."visas_id_seq";


  create table "public"."countries" (
    "id" integer not null default nextval('public.countries_id_seq'::regclass),
    "continent" text not null,
    "name" text not null,
    "iso_code" character(2),
    "flag_url" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."visas" (
    "id" integer not null default nextval('public.visas_id_seq'::regclass),
    "name" text not null,
    "country_id" integer,
    "visa_type" text,
    "description" text,
    "benefits" text[],
    "min_age" integer,
    "max_age" integer,
    "min_income" numeric(14,2),
    "min_income_currency" text,
    "min_savings" numeric(14,2),
    "min_savings_currency" text,
    "required_skills" text[],
    "eligible_nationalities" text[],
    "excluded_nationalities" text[],
    "requires_health_insurance" boolean default false,
    "requires_clean_criminal_record" boolean default false,
    "processing_time_days" integer,
    "validity_months" integer,
    "renewable" boolean default false,
    "path_to_residency" text,
    "application_fee_usd" numeric(12,2),
    "application_fee_currency" text,
    "required_documents" text[],
    "official_link" text,
    "image_url" text,
    "additional_info" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter sequence "public"."countries_id_seq" owned by "public"."countries"."id";

alter sequence "public"."visas_id_seq" owned by "public"."visas"."id";

CREATE UNIQUE INDEX countries_pkey ON public.countries USING btree (id);

CREATE UNIQUE INDEX idx_countries_name ON public.countries USING btree (name);

CREATE INDEX idx_visas_country ON public.visas USING btree (country_id);

CREATE INDEX idx_visas_name ON public.visas USING btree (name);

CREATE UNIQUE INDEX visas_pkey ON public.visas USING btree (id);

alter table "public"."countries" add constraint "countries_pkey" PRIMARY KEY using index "countries_pkey";

alter table "public"."visas" add constraint "visas_pkey" PRIMARY KEY using index "visas_pkey";

alter table "public"."visas" add constraint "visas_country_id_fkey" FOREIGN KEY (country_id) REFERENCES public.countries(id) not valid;

alter table "public"."visas" validate constraint "visas_country_id_fkey";

grant delete on table "public"."countries" to "anon";

grant insert on table "public"."countries" to "anon";

grant references on table "public"."countries" to "anon";

grant select on table "public"."countries" to "anon";

grant trigger on table "public"."countries" to "anon";

grant truncate on table "public"."countries" to "anon";

grant update on table "public"."countries" to "anon";

grant delete on table "public"."countries" to "authenticated";

grant insert on table "public"."countries" to "authenticated";

grant references on table "public"."countries" to "authenticated";

grant select on table "public"."countries" to "authenticated";

grant trigger on table "public"."countries" to "authenticated";

grant truncate on table "public"."countries" to "authenticated";

grant update on table "public"."countries" to "authenticated";

grant delete on table "public"."countries" to "service_role";

grant insert on table "public"."countries" to "service_role";

grant references on table "public"."countries" to "service_role";

grant select on table "public"."countries" to "service_role";

grant trigger on table "public"."countries" to "service_role";

grant truncate on table "public"."countries" to "service_role";

grant update on table "public"."countries" to "service_role";

grant delete on table "public"."visas" to "anon";

grant insert on table "public"."visas" to "anon";

grant references on table "public"."visas" to "anon";

grant select on table "public"."visas" to "anon";

grant trigger on table "public"."visas" to "anon";

grant truncate on table "public"."visas" to "anon";

grant update on table "public"."visas" to "anon";

grant delete on table "public"."visas" to "authenticated";

grant insert on table "public"."visas" to "authenticated";

grant references on table "public"."visas" to "authenticated";

grant select on table "public"."visas" to "authenticated";

grant trigger on table "public"."visas" to "authenticated";

grant truncate on table "public"."visas" to "authenticated";

grant update on table "public"."visas" to "authenticated";

grant delete on table "public"."visas" to "service_role";

grant insert on table "public"."visas" to "service_role";

grant references on table "public"."visas" to "service_role";

grant select on table "public"."visas" to "service_role";

grant trigger on table "public"."visas" to "service_role";

grant truncate on table "public"."visas" to "service_role";

grant update on table "public"."visas" to "service_role";


