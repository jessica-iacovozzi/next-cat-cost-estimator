CREATE TABLE sterilization_costs (
    id SERIAL PRIMARY KEY,
    life_stage_id INTEGER REFERENCES life_stages(id) ON DELETE CASCADE CHECK (life_stage_id = 1), -- Only for kittens
    sex TEXT CHECK (sex IN ('Male', 'Female')) NOT NULL,
    cost NUMERIC NOT NULL,
    year INTEGER NOT NULL DEFAULT extract(year FROM now()),
    UNIQUE (life_stage_id, sex, year)
);