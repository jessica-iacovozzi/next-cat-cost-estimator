CREATE TABLE annual_costs (
    id SERIAL PRIMARY KEY,
    life_stage_id INTEGER REFERENCES life_stages(id) ON DELETE CASCADE,
    expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
    lifestyle TEXT CHECK (lifestyle IN ('Indoor', 'Outdoor')) NOT NULL,
    cost NUMERIC NOT NULL,
    year INTEGER NOT NULL DEFAULT extract(year FROM now()),
    UNIQUE (life_stage_id, expense_id, lifestyle, year)
);

CREATE INDEX idx_annual_costs_life_stage ON annual_costs(life_stage_id);
CREATE INDEX idx_annual_costs_expense ON annual_costs(expense_id);
CREATE INDEX idx_annual_costs_lifestyle ON annual_costs(lifestyle);
