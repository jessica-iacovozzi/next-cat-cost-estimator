-- Get the IDs for unfixed male and female cats
DO $$
DECLARE
  male_id INTEGER;
  female_id INTEGER;
BEGIN
  -- Get IDs for unfixed cats (these are the ones that need sterilization)
  SELECT id INTO male_id FROM sexes WHERE name = 'Male' AND is_fixed = false;
  SELECT id INTO female_id FROM sexes WHERE name = 'Female' AND is_fixed = false;
  
  -- Insert sterilization costs for unfixed cats
  -- These costs represent what it would cost to fix (neuter/spay) these cats
  INSERT INTO sterilization_costs(sex_id, cost, year)
  VALUES
    (male_id, 357, 2025),  -- Cost to neuter a male cat
    (female_id, 471, 2025); -- Cost to spay a female cat
END $$;