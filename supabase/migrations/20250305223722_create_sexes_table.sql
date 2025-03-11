-- Create a sequence for the sexes table
create sequence "public"."sexes_id_seq";

-- Create the sexes table
create table "public"."sexes" (
    "id" integer not null default nextval('sexes_id_seq'::regclass),
    "name" text not null,
    "is_fixed" boolean not null default false
);

-- Set ownership of sequence
alter sequence "public"."sexes_id_seq" owned by "public"."sexes"."id";

-- Create indexes for the sexes table
CREATE UNIQUE INDEX sexes_pkey ON public.sexes USING btree (id);
CREATE UNIQUE INDEX sexes_name_is_fixed_key ON public.sexes USING btree (name, is_fixed);

-- Add primary key constraint
alter table "public"."sexes" add constraint "sexes_pkey" PRIMARY KEY using index "sexes_pkey";

-- Add unique constraint
alter table "public"."sexes" add constraint "sexes_name_is_fixed_key" UNIQUE using index "sexes_name_is_fixed_key";

-- Add check constraint for name
alter table "public"."sexes" add constraint "sexes_name_check" CHECK ((name = ANY (ARRAY['Male'::text, 'Female'::text]))) not valid;
alter table "public"."sexes" validate constraint "sexes_name_check";

-- Grant permissions
grant delete on table "public"."sexes" to "anon";
grant insert on table "public"."sexes" to "anon";
grant references on table "public"."sexes" to "anon";
grant select on table "public"."sexes" to "anon";
grant trigger on table "public"."sexes" to "anon";
grant truncate on table "public"."sexes" to "anon";
grant update on table "public"."sexes" to "anon";

grant delete on table "public"."sexes" to "authenticated";
grant insert on table "public"."sexes" to "authenticated";
grant references on table "public"."sexes" to "authenticated";
grant select on table "public"."sexes" to "authenticated";
grant trigger on table "public"."sexes" to "authenticated";
grant truncate on table "public"."sexes" to "authenticated";
grant update on table "public"."sexes" to "authenticated";

grant delete on table "public"."sexes" to "service_role";
grant insert on table "public"."sexes" to "service_role";
grant references on table "public"."sexes" to "service_role";
grant select on table "public"."sexes" to "service_role";
grant trigger on table "public"."sexes" to "service_role";
grant truncate on table "public"."sexes" to "service_role";
grant update on table "public"."sexes" to "service_role";

-- Insert the four sex options
INSERT INTO "public"."sexes" ("name", "is_fixed") VALUES
('Male', false),
('Male', true),
('Female', false),
('Female', true);

-- Modify the sterilization_costs table
-- First, add a new sex_id column
ALTER TABLE "public"."sterilization_costs" ADD COLUMN "sex_id" integer;

-- Update the existing records to set the sex_id based on the sex column
UPDATE "public"."sterilization_costs" SET "sex_id" = s.id
FROM "public"."sexes" s
WHERE "sterilization_costs"."sex" = s.name AND s.is_fixed = true;

-- Add foreign key constraint
ALTER TABLE "public"."sterilization_costs" ADD CONSTRAINT "sterilization_costs_sex_id_fkey"
FOREIGN KEY ("sex_id") REFERENCES "public"."sexes"("id") ON DELETE CASCADE;

-- Drop the old unique constraint
ALTER TABLE "public"."sterilization_costs" DROP CONSTRAINT IF EXISTS "sterilization_costs_sex_year_key";
DROP INDEX IF EXISTS "sterilization_costs_sex_year_key";

-- Create a new unique constraint with sex_id
CREATE UNIQUE INDEX sterilization_costs_sex_id_year_key ON public.sterilization_costs USING btree (sex_id, year);
ALTER TABLE "public"."sterilization_costs" ADD CONSTRAINT "sterilization_costs_sex_id_year_key" UNIQUE USING INDEX "sterilization_costs_sex_id_year_key";

-- Make sex_id not null after data migration
ALTER TABLE "public"."sterilization_costs" ALTER COLUMN "sex_id" SET NOT NULL;

-- Finally, drop the old sex column
ALTER TABLE "public"."sterilization_costs" DROP COLUMN "sex";