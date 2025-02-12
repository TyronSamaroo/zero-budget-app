-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    name VARCHAR(255)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL DEFAULT 1,
    amount DECIMAL(10,2) DEFAULT 0,
    spent DECIMAL(10,2) DEFAULT 0,
    remaining DECIMAL(10,2) DEFAULT 0,
    is_fixed BOOLEAN DEFAULT FALSE,
    is_flexible BOOLEAN DEFAULT FALSE,
    min_amount DECIMAL(10,2) DEFAULT 0,
    max_amount DECIMAL(10,2) DEFAULT 0,
    progress DECIMAL(5,2) DEFAULT 0,
    color VARCHAR(7),
    icon VARCHAR(50)
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    user_id INTEGER NOT NULL DEFAULT 1,
    category_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    spent DECIMAL(10,2) DEFAULT 0,
    remaining DECIMAL(10,2) DEFAULT 0,
    is_fixed BOOLEAN DEFAULT FALSE,
    is_flexible BOOLEAN DEFAULT FALSE,
    min_amount DECIMAL(10,2) DEFAULT 0,
    max_amount DECIMAL(10,2) DEFAULT 0,
    progress DECIMAL(5,2) DEFAULT 0,
    CONSTRAINT fk_categories_budgets
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
); 