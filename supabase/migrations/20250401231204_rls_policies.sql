-- Enable RLS on tables
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sterilization_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_expenses ENABLE ROW LEVEL SECURITY;

-- Create read policies for public tables
CREATE POLICY "Allow public read access" 
ON expenses
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access" 
ON annual_costs
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access" 
ON life_stages
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access" 
ON sexes
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access" 
ON sterilization_costs
FOR SELECT 
USING (true);

-- Create write policies for public tables
CREATE POLICY "Only superusers can insert"
ON expenses
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can update"
ON expenses
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can delete"
ON expenses
FOR DELETE
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can insert"
ON annual_costs
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can update"
ON annual_costs
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can delete"
ON annual_costs
FOR DELETE
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can insert"
ON life_stages
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can update"
ON life_stages
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can delete"
ON life_stages
FOR DELETE
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can insert"
ON sexes
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can update"
ON sexes
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can delete"
ON sexes
FOR DELETE
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can insert"
ON sterilization_costs
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can update"
ON sterilization_costs
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Only superusers can delete"
ON sterilization_costs
FOR DELETE
USING (auth.jwt() ->> 'role' = 'service_role');

-- For user_estimates
CREATE POLICY "Users can view their own estimates"
ON user_estimates
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own estimates"
ON user_estimates
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own estimates"
ON user_estimates
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own estimates"
ON user_estimates
FOR DELETE
USING (auth.uid() = user_id);

-- For user_expenses
CREATE POLICY "Users can view their own expenses"
ON user_expenses
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_estimates
  WHERE user_expenses.user_estimate_id = user_estimates.id
  AND user_estimates.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own expenses"
ON user_expenses
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM user_estimates
  WHERE user_expenses.user_estimate_id = user_estimates.id
  AND user_estimates.user_id = auth.uid()
));

CREATE POLICY "Users can update their own expenses"
ON user_expenses
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM user_estimates
  WHERE user_expenses.user_estimate_id = user_estimates.id
  AND user_estimates.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM user_estimates
  WHERE user_expenses.user_estimate_id = user_estimates.id
  AND user_estimates.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own expenses"
ON user_expenses
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM user_estimates
  WHERE user_expenses.user_estimate_id = user_estimates.id
  AND user_estimates.user_id = auth.uid()
));