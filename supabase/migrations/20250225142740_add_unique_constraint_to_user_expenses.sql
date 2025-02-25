ALTER TABLE user_expenses
ADD CONSTRAINT unique_user_estimate_expense 
UNIQUE (user_estimate_id, name);