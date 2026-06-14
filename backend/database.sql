-- Food Ordering Database Schema (PostgreSQL)
-- Create database first: createdb food_ordering
-- Then run: psql -d food_ordering -f database.sql

-- Custom enum types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'banned');
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'delivered', 'cancelled');

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Food items table
CREATE TABLE food_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TRIGGER update_food_items_updated_at
  BEFORE UPDATE ON food_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'pending',
    delivery_address TEXT,
    phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
);

-- Cart table (for logged-in users)
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
    CONSTRAINT unique_cart_item UNIQUE (user_id, food_item_id)
);

CREATE TRIGGER update_cart_updated_at
  BEFORE UPDATE ON cart
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Performance indexes
CREATE INDEX idx_food_items_category_id ON food_items(category_id);
CREATE INDEX idx_food_items_is_available ON food_items(is_available);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_food_item_id ON order_items(food_item_id);
CREATE INDEX idx_cart_user_id ON cart(user_id);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Burgers', 'Delicious burgers with various toppings'),
('Pizza', 'Fresh pizzas with different toppings'),
('Pasta', 'Italian pasta dishes'),
('Drinks', 'Beverages and soft drinks'),
('Desserts', 'Sweet treats and desserts');

-- Insert sample food items
INSERT INTO food_items (name, description, price, category_id, is_available) VALUES
('Classic Burger', 'Juicy beef patty with lettuce, tomato, and onions', 280.00, 1, TRUE),
('Cheese Burger', 'Classic burger with melted cheese', 320.00, 1, TRUE),
('BBQ Burger', 'Burger with BBQ sauce and onion rings', 350.00, 1, TRUE),
('Margherita Pizza', 'Fresh mozzarella, tomato sauce, and basil', 450.00, 2, TRUE),
('Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 520.00, 2, TRUE),
('Vegetarian Pizza', 'Bell peppers, mushrooms, olives, and tomatoes', 480.00, 2, TRUE),
('Spaghetti Carbonara', 'Creamy pasta with bacon and parmesan', 380.00, 3, TRUE),
('Fettuccine Alfredo', 'Rich alfredo sauce with fettuccine pasta', 360.00, 3, TRUE),
('Coca Cola', 'Refreshing cola drink', 60.00, 4, TRUE),
('Orange Juice', 'Fresh orange juice', 80.00, 4, TRUE),
('Ice Cream', 'Vanilla ice cream with chocolate sauce', 120.00, 5, TRUE),
('Chocolate Cake', 'Rich chocolate cake with frosting', 150.00, 5, TRUE);

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@foodordering.com', '$2a$10$Fu./8PItANE0S8/wBrpOvetlNcAXXXYViH0gin0GF6XUkOy/IAmhK', 'admin');
