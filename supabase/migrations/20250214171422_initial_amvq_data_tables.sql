create sequence "public"."annual_costs_id_seq";

create sequence "public"."expenses_id_seq";

create sequence "public"."life_stages_id_seq";

create sequence "public"."sterilization_costs_id_seq";

create table "public"."annual_costs" (
    "id" integer not null default nextval('annual_costs_id_seq'::regclass),
    "life_stage_id" integer,
    "expense_id" integer,
    "lifestyle" text not null,
    "cost" numeric not null,
    "year" integer not null default EXTRACT(year FROM now())
);


create table "public"."expenses" (
    "id" integer not null default nextval('expenses_id_seq'::regclass),
    "name" text not null
);


create table "public"."life_stages" (
    "id" integer not null default nextval('life_stages_id_seq'::regclass),
    "name" text not null
);


create table "public"."sterilization_costs" (
    "id" integer not null default nextval('sterilization_costs_id_seq'::regclass),
    "life_stage_id" integer,
    "sex" text not null,
    "cost" numeric not null,
    "year" integer not null default EXTRACT(year FROM now())
);


alter sequence "public"."annual_costs_id_seq" owned by "public"."annual_costs"."id";

alter sequence "public"."expenses_id_seq" owned by "public"."expenses"."id";

alter sequence "public"."life_stages_id_seq" owned by "public"."life_stages"."id";

alter sequence "public"."sterilization_costs_id_seq" owned by "public"."sterilization_costs"."id";

CREATE UNIQUE INDEX annual_costs_life_stage_id_expense_id_lifestyle_year_key ON public.annual_costs USING btree (life_stage_id, expense_id, lifestyle, year);

CREATE UNIQUE INDEX annual_costs_pkey ON public.annual_costs USING btree (id);

CREATE UNIQUE INDEX expenses_name_key ON public.expenses USING btree (name);

CREATE UNIQUE INDEX expenses_pkey ON public.expenses USING btree (id);

CREATE UNIQUE INDEX life_stages_name_key ON public.life_stages USING btree (name);

CREATE UNIQUE INDEX life_stages_pkey ON public.life_stages USING btree (id);

CREATE UNIQUE INDEX sterilization_costs_life_stage_id_sex_year_key ON public.sterilization_costs USING btree (life_stage_id, sex, year);

CREATE UNIQUE INDEX sterilization_costs_pkey ON public.sterilization_costs USING btree (id);

alter table "public"."annual_costs" add constraint "annual_costs_pkey" PRIMARY KEY using index "annual_costs_pkey";

alter table "public"."expenses" add constraint "expenses_pkey" PRIMARY KEY using index "expenses_pkey";

alter table "public"."life_stages" add constraint "life_stages_pkey" PRIMARY KEY using index "life_stages_pkey";

alter table "public"."sterilization_costs" add constraint "sterilization_costs_pkey" PRIMARY KEY using index "sterilization_costs_pkey";

alter table "public"."annual_costs" add constraint "annual_costs_expense_id_fkey" FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE not valid;

alter table "public"."annual_costs" validate constraint "annual_costs_expense_id_fkey";

alter table "public"."annual_costs" add constraint "annual_costs_life_stage_id_expense_id_lifestyle_year_key" UNIQUE using index "annual_costs_life_stage_id_expense_id_lifestyle_year_key";

alter table "public"."annual_costs" add constraint "annual_costs_life_stage_id_fkey" FOREIGN KEY (life_stage_id) REFERENCES life_stages(id) ON DELETE CASCADE not valid;

alter table "public"."annual_costs" validate constraint "annual_costs_life_stage_id_fkey";

alter table "public"."annual_costs" add constraint "annual_costs_lifestyle_check" CHECK ((lifestyle = ANY (ARRAY['Indoor'::text, 'Outdoor'::text]))) not valid;

alter table "public"."annual_costs" validate constraint "annual_costs_lifestyle_check";

alter table "public"."expenses" add constraint "expenses_name_key" UNIQUE using index "expenses_name_key";

alter table "public"."life_stages" add constraint "life_stages_name_key" UNIQUE using index "life_stages_name_key";

alter table "public"."sterilization_costs" add constraint "sterilization_costs_life_stage_id_check" CHECK ((life_stage_id = 1)) not valid;

alter table "public"."sterilization_costs" validate constraint "sterilization_costs_life_stage_id_check";

alter table "public"."sterilization_costs" add constraint "sterilization_costs_life_stage_id_fkey" FOREIGN KEY (life_stage_id) REFERENCES life_stages(id) ON DELETE CASCADE not valid;

alter table "public"."sterilization_costs" validate constraint "sterilization_costs_life_stage_id_fkey";

alter table "public"."sterilization_costs" add constraint "sterilization_costs_life_stage_id_sex_year_key" UNIQUE using index "sterilization_costs_life_stage_id_sex_year_key";

alter table "public"."sterilization_costs" add constraint "sterilization_costs_sex_check" CHECK ((sex = ANY (ARRAY['Male'::text, 'Female'::text]))) not valid;

alter table "public"."sterilization_costs" validate constraint "sterilization_costs_sex_check";

grant delete on table "public"."annual_costs" to "anon";

grant insert on table "public"."annual_costs" to "anon";

grant references on table "public"."annual_costs" to "anon";

grant select on table "public"."annual_costs" to "anon";

grant trigger on table "public"."annual_costs" to "anon";

grant truncate on table "public"."annual_costs" to "anon";

grant update on table "public"."annual_costs" to "anon";

grant delete on table "public"."annual_costs" to "authenticated";

grant insert on table "public"."annual_costs" to "authenticated";

grant references on table "public"."annual_costs" to "authenticated";

grant select on table "public"."annual_costs" to "authenticated";

grant trigger on table "public"."annual_costs" to "authenticated";

grant truncate on table "public"."annual_costs" to "authenticated";

grant update on table "public"."annual_costs" to "authenticated";

grant delete on table "public"."annual_costs" to "service_role";

grant insert on table "public"."annual_costs" to "service_role";

grant references on table "public"."annual_costs" to "service_role";

grant select on table "public"."annual_costs" to "service_role";

grant trigger on table "public"."annual_costs" to "service_role";

grant truncate on table "public"."annual_costs" to "service_role";

grant update on table "public"."annual_costs" to "service_role";

grant delete on table "public"."expenses" to "anon";

grant insert on table "public"."expenses" to "anon";

grant references on table "public"."expenses" to "anon";

grant select on table "public"."expenses" to "anon";

grant trigger on table "public"."expenses" to "anon";

grant truncate on table "public"."expenses" to "anon";

grant update on table "public"."expenses" to "anon";

grant delete on table "public"."expenses" to "authenticated";

grant insert on table "public"."expenses" to "authenticated";

grant references on table "public"."expenses" to "authenticated";

grant select on table "public"."expenses" to "authenticated";

grant trigger on table "public"."expenses" to "authenticated";

grant truncate on table "public"."expenses" to "authenticated";

grant update on table "public"."expenses" to "authenticated";

grant delete on table "public"."expenses" to "service_role";

grant insert on table "public"."expenses" to "service_role";

grant references on table "public"."expenses" to "service_role";

grant select on table "public"."expenses" to "service_role";

grant trigger on table "public"."expenses" to "service_role";

grant truncate on table "public"."expenses" to "service_role";

grant update on table "public"."expenses" to "service_role";

grant delete on table "public"."life_stages" to "anon";

grant insert on table "public"."life_stages" to "anon";

grant references on table "public"."life_stages" to "anon";

grant select on table "public"."life_stages" to "anon";

grant trigger on table "public"."life_stages" to "anon";

grant truncate on table "public"."life_stages" to "anon";

grant update on table "public"."life_stages" to "anon";

grant delete on table "public"."life_stages" to "authenticated";

grant insert on table "public"."life_stages" to "authenticated";

grant references on table "public"."life_stages" to "authenticated";

grant select on table "public"."life_stages" to "authenticated";

grant trigger on table "public"."life_stages" to "authenticated";

grant truncate on table "public"."life_stages" to "authenticated";

grant update on table "public"."life_stages" to "authenticated";

grant delete on table "public"."life_stages" to "service_role";

grant insert on table "public"."life_stages" to "service_role";

grant references on table "public"."life_stages" to "service_role";

grant select on table "public"."life_stages" to "service_role";

grant trigger on table "public"."life_stages" to "service_role";

grant truncate on table "public"."life_stages" to "service_role";

grant update on table "public"."life_stages" to "service_role";

grant delete on table "public"."sterilization_costs" to "anon";

grant insert on table "public"."sterilization_costs" to "anon";

grant references on table "public"."sterilization_costs" to "anon";

grant select on table "public"."sterilization_costs" to "anon";

grant trigger on table "public"."sterilization_costs" to "anon";

grant truncate on table "public"."sterilization_costs" to "anon";

grant update on table "public"."sterilization_costs" to "anon";

grant delete on table "public"."sterilization_costs" to "authenticated";

grant insert on table "public"."sterilization_costs" to "authenticated";

grant references on table "public"."sterilization_costs" to "authenticated";

grant select on table "public"."sterilization_costs" to "authenticated";

grant trigger on table "public"."sterilization_costs" to "authenticated";

grant truncate on table "public"."sterilization_costs" to "authenticated";

grant update on table "public"."sterilization_costs" to "authenticated";

grant delete on table "public"."sterilization_costs" to "service_role";

grant insert on table "public"."sterilization_costs" to "service_role";

grant references on table "public"."sterilization_costs" to "service_role";

grant select on table "public"."sterilization_costs" to "service_role";

grant trigger on table "public"."sterilization_costs" to "service_role";

grant truncate on table "public"."sterilization_costs" to "service_role";

grant update on table "public"."sterilization_costs" to "service_role";


