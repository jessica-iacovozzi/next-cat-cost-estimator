-- Create a function to reorder expenses
CREATE OR REPLACE FUNCTION reorder_expenses(
  p_expense_id INT,
  p_estimate_id INT,
  p_old_order INT,
  p_new_order INT
) RETURNS VOID AS $$
BEGIN
  -- Moving down: decrement order for items between old_order+1 and new_order
  IF p_old_order < p_new_order THEN
    UPDATE user_expenses
    SET "order" = "order" - 1
    WHERE user_estimate_id = p_estimate_id
      AND "order" > p_old_order
      AND "order" <= p_new_order;
  
  -- Moving up: increment order for items between new_order and old_order-1
  ELSIF p_old_order > p_new_order THEN
    UPDATE user_expenses
    SET "order" = "order" + 1
    WHERE user_estimate_id = p_estimate_id
      AND "order" >= p_new_order
      AND "order" < p_old_order;
  END IF;
  
  -- Update the target expense's order
  UPDATE user_expenses
  SET "order" = p_new_order
  WHERE id = p_expense_id;
END;
$$ LANGUAGE plpgsql;
