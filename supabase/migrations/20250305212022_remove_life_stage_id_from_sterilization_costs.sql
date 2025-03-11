-- Remove life_stage_id column from sterilization_costs table
-- First, drop the existing constraints and indexes that reference life_stage_id
ALTER TABLE "public"."sterilization_costs" DROP CONSTRAINT IF EXISTS "sterilization_costs_life_stage_id_check";
ALTER TABLE "public"."sterilization_costs" DROP CONSTRAINT IF EXISTS "sterilization_costs_life_stage_id_fkey";
ALTER TABLE "public"."sterilization_costs" DROP CONSTRAINT IF EXISTS "sterilization_costs_life_stage_id_sex_year_key";
DROP INDEX IF EXISTS "sterilization_costs_life_stage_id_sex_year_key";

-- Create a new unique constraint for sex and year
CREATE UNIQUE INDEX sterilization_costs_sex_year_key ON public.sterilization_costs USING btree (sex, year);
ALTER TABLE "public"."sterilization_costs" ADD CONSTRAINT "sterilization_costs_sex_year_key" UNIQUE USING INDEX "sterilization_costs_sex_year_key";

-- Finally, drop the life_stage_id column
ALTER TABLE "public"."sterilization_costs" DROP COLUMN IF EXISTS "life_stage_id";
