create sequence "public"."user_estimates_id_seq";

create sequence "public"."user_expenses_id_seq";

create table "public"."user_estimates" (
    "id" integer not null default nextval('user_estimates_id_seq'::regclass),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "user_id" uuid not null
);


create table "public"."user_expenses" (
    "id" integer not null default nextval('user_expenses_id_seq'::regclass),
    "user_estimate_id" integer not null,
    "name" text,
    "cost" numeric(10,2) not null
);


alter sequence "public"."user_estimates_id_seq" owned by "public"."user_estimates"."id";

alter sequence "public"."user_expenses_id_seq" owned by "public"."user_expenses"."id";

CREATE INDEX idx_annual_costs_expense ON public.annual_costs USING btree (expense_id);

CREATE INDEX idx_annual_costs_life_stage ON public.annual_costs USING btree (life_stage_id);

CREATE INDEX idx_annual_costs_lifestyle ON public.annual_costs USING btree (lifestyle);

CREATE INDEX idx_sterilization_costs_life_stage ON public.sterilization_costs USING btree (life_stage_id);

CREATE INDEX idx_sterilization_costs_sex ON public.sterilization_costs USING btree (sex);

CREATE UNIQUE INDEX user_estimates_pkey ON public.user_estimates USING btree (id);

CREATE UNIQUE INDEX user_expenses_pkey ON public.user_expenses USING btree (id);

alter table "public"."user_estimates" add constraint "user_estimates_pkey" PRIMARY KEY using index "user_estimates_pkey";

alter table "public"."user_expenses" add constraint "user_expenses_pkey" PRIMARY KEY using index "user_expenses_pkey";

alter table "public"."user_estimates" add constraint "user_estimates_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_estimates" validate constraint "user_estimates_user_id_fkey";

alter table "public"."user_expenses" add constraint "user_expenses_user_estimate_id_fkey" FOREIGN KEY (user_estimate_id) REFERENCES user_estimates(id) not valid;

alter table "public"."user_expenses" validate constraint "user_expenses_user_estimate_id_fkey";

grant delete on table "public"."user_estimates" to "anon";

grant insert on table "public"."user_estimates" to "anon";

grant references on table "public"."user_estimates" to "anon";

grant select on table "public"."user_estimates" to "anon";

grant trigger on table "public"."user_estimates" to "anon";

grant truncate on table "public"."user_estimates" to "anon";

grant update on table "public"."user_estimates" to "anon";

grant delete on table "public"."user_estimates" to "authenticated";

grant insert on table "public"."user_estimates" to "authenticated";

grant references on table "public"."user_estimates" to "authenticated";

grant select on table "public"."user_estimates" to "authenticated";

grant trigger on table "public"."user_estimates" to "authenticated";

grant truncate on table "public"."user_estimates" to "authenticated";

grant update on table "public"."user_estimates" to "authenticated";

grant delete on table "public"."user_estimates" to "service_role";

grant insert on table "public"."user_estimates" to "service_role";

grant references on table "public"."user_estimates" to "service_role";

grant select on table "public"."user_estimates" to "service_role";

grant trigger on table "public"."user_estimates" to "service_role";

grant truncate on table "public"."user_estimates" to "service_role";

grant update on table "public"."user_estimates" to "service_role";

grant delete on table "public"."user_expenses" to "anon";

grant insert on table "public"."user_expenses" to "anon";

grant references on table "public"."user_expenses" to "anon";

grant select on table "public"."user_expenses" to "anon";

grant trigger on table "public"."user_expenses" to "anon";

grant truncate on table "public"."user_expenses" to "anon";

grant update on table "public"."user_expenses" to "anon";

grant delete on table "public"."user_expenses" to "authenticated";

grant insert on table "public"."user_expenses" to "authenticated";

grant references on table "public"."user_expenses" to "authenticated";

grant select on table "public"."user_expenses" to "authenticated";

grant trigger on table "public"."user_expenses" to "authenticated";

grant truncate on table "public"."user_expenses" to "authenticated";

grant update on table "public"."user_expenses" to "authenticated";

grant delete on table "public"."user_expenses" to "service_role";

grant insert on table "public"."user_expenses" to "service_role";

grant references on table "public"."user_expenses" to "service_role";

grant select on table "public"."user_expenses" to "service_role";

grant trigger on table "public"."user_expenses" to "service_role";

grant truncate on table "public"."user_expenses" to "service_role";

grant update on table "public"."user_expenses" to "service_role";


