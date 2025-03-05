-- Add order column to user_expenses table
ALTER TABLE user_expenses ADD COLUMN "order" INTEGER;

-- Create a temporary function to set order alphabetically
CREATE OR REPLACE FUNCTION set_alphabetical_order() RETURNS VOID AS $$
DECLARE
  estimate_id INT;
  expense_record RECORD;
  current_order INT;
BEGIN
  -- For each user_estimate_id
  FOR estimate_id IN SELECT DISTINCT user_estimate_id FROM user_expenses LOOP
    current_order := 0;
    
    -- For each expense in this estimate, ordered alphabetically by name
    FOR expense_record IN 
      SELECT id 
      FROM user_expenses 
      WHERE user_estimate_id = estimate_id 
      ORDER BY name ASC
    LOOP
      -- Set the order value
      UPDATE user_expenses 
      SET "order" = current_order 
      WHERE id = expense_record.id;
      
      -- Increment order for next expense
      current_order := current_order + 1;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to set alphabetical order
SELECT set_alphabetical_order();

-- Drop the temporary function
DROP FUNCTION set_alphabetical_order();

-- Make order non-nullable after setting defaults
ALTER TABLE user_expenses ALTER COLUMN "order" SET NOT NULL;

-- Add index on order and user_estimate_id for faster sorting
CREATE INDEX idx_user_expenses_order ON user_expenses ("order", user_estimate_id);
