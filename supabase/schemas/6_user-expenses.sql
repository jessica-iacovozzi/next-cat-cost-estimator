CREATE TABLE user_expenses (
  id SERIAL PRIMARY KEY,
  user_estimate_id integer references user_estimates(id) not null,
  name text,
  cost numeric(10,2) not null,
);