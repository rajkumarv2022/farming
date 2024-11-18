-- User table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    is_seller INTEGER NOT NULL DEFAULT 0
);

-- Product table
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    typeofPrd TEXT,
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

-- Order history table
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    total_price REAL NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    typeofPrd TEXT
    

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

    -- username TEXT,
    -- age INTEGER,
    -- address TEXT,
    -- paymentType TEXT,
    -- phoneNumber TEXT,
    -- email TEXT,
--Add to CartDB

CREATE TABLE IF NOT EXISTS cart (
    cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    typeofPrd TEXT,
    FOREIGN KEY (seller_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS ordhist (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    total_price REAL NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    typeofPrd TEXT,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


ALTER TABLE orders
ADD typeofPrd TEXT;

ALTER TABLE cart
ADD typeofPrd TEXT;




