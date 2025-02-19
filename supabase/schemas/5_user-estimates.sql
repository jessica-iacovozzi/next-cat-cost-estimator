CREATE TABLE user_estimates (
  id SERIAL PRIMARY KEY,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);