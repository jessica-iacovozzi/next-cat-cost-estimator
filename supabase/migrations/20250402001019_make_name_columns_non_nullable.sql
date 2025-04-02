UPDATE user_estimates SET name = '' WHERE name IS NULL;
UPDATE user_expenses SET name = '' WHERE name IS NULL;

ALTER TABLE user_estimates ALTER COLUMN name SET NOT NULL;
ALTER TABLE user_expenses ALTER COLUMN name SET NOT NULL;
