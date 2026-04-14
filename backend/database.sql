-- Food Ordering Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS food_ordering;
USE food_ordering;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('user', 'admin', 'banned') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food items table
CREATE TABLE food_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT,
    phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
);

-- Cart table (for logged-in users)
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, food_item_id)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Burgers', 'Delicious burgers with various toppings'),
('Pizza', 'Fresh pizzas with different toppings'),
('Pasta', 'Italian pasta dishes'),
('Drinks', 'Beverages and soft drinks'),
('Desserts', 'Sweet treats and desserts');

-- Insert sample food items
INSERT INTO food_items (name, description, price, category_id, is_available) VALUES
('Classic Burger', 'Juicy beef patty with lettuce, tomato, and onions', 8.99, 1, TRUE),
('Cheese Burger', 'Classic burger with melted cheese', 9.99, 1, TRUE),
('BBQ Burger', 'Burger with BBQ sauce and onion rings', 10.99, 1, TRUE),
('Margherita Pizza', 'Fresh mozzarella, tomato sauce, and basil', 12.99, 2, TRUE),
('Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 14.99, 2, TRUE),
('Vegetarian Pizza', 'Bell peppers, mushrooms, olives, and tomatoes', 13.99, 2, TRUE),
('Spaghetti Carbonara', 'Creamy pasta with bacon and parmesan', 11.99, 3, TRUE),
('Fettuccine Alfredo', 'Rich alfredo sauce with fettuccine pasta', 10.99, 3, TRUE),
('Coca Cola', 'Refreshing cola drink', 2.99, 4, TRUE),
('Orange Juice', 'Fresh orange juice', 3.99, 4, TRUE),
('Ice Cream', 'Vanilla ice cream with chocolate sauce', 4.99, 5, TRUE),
('Chocolate Cake', 'Rich chocolate cake with frosting', 5.99, 5, TRUE);

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@foodordering.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
