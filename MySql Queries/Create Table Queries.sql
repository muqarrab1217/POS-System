use possystem;


CREATE TABLE Users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY ON DELETE CASCADE, -- Use BIGINT UNSIGNED to match `created_by` later
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Items (
    item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,   -- Unique product ID with auto-increment
    name VARCHAR(100) NOT NULL,                           -- Product name
    description TEXT,                                     -- Description of the product
    item_path VARCHAR(255),                               -- Path to the product image (optional)
    price DECIMAL(10, 2) NOT NULL,                        -- Price of the product
    category ENUM('FastFood', 'Desert', 'Drinks') NOT NULL, -- Category (with restricted options)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        -- Timestamp when product was added
);

CREATE TABLE Reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,   -- Unique report ID with auto-increment
    report_name VARCHAR(255) NOT NULL,          -- Name of the report
    report_path VARCHAR(500) NOT NULL,          -- Path to the report file (PDF, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the report was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- When the report was last updated
);


CREATE TABLE Orders (
    order_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- Use BIGINT UNSIGNED to match `created_by`
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    discount DECIMAL(5, 2) DEFAULT 0.00,
    payment_method VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    staff_id BIGINT UNSIGNED, -- Change to BIGINT UNSIGNED to match `Users.id`
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (staff_id) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE OrderDetails (
    order_details_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  -- Unique ID for each order detail
    order_id BIGINT UNSIGNED,                                      -- Foreign key for the order
    item_id BIGINT UNSIGNED,                                        -- Foreign key for the item
    customer_id INT,                                                -- Foreign key for the customer
    quantity INT NOT NULL DEFAULT 1,                                 -- Quantity of the item
    price DECIMAL(10, 2) NOT NULL,                                  -- Price of the item at the time of order
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,  -- References Orders table
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,    -- References Items table
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL  -- References Customers table
);

CREATE TABLE Inventory (
    inventory_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT UNSIGNED NOT NULL,
    quantity INT DEFAULT 0,
    location VARCHAR(100) NOT NULL,  -- New column for stock location
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
);


CREATE TABLE Payments (
    payment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

CREATE TABLE Customers(
    customer_id INT AUTO_INCREMENT PRIMARY KEY,      -- Unique ID for each customer
    phone_number VARCHAR(15) UNIQUE NOT NULL,        -- Customer's phone number (must be unique)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of when the customer was added
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Last updated timestamp
);

CREATE TABLE reservation (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID for each reservation (auto-incremented)
    table_name VARCHAR(255) NOT NULL,               -- Name or identifier of the table
    customer_id INT,                               -- Reference to the customer making the reservation
    staff_id BIGINT UNSIGNED NULL,                      -- Reference to the staff member handling the reservation
    order_id BIGINT UNSIGNED,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),  -- Assuming there's a 'customers' table
    FOREIGN KEY (staff_id) REFERENCES Users(id) ON DELETE SET NULL,  -- Reference to the Users table
    status VARCHAR(50) NOT NULL                    -- Status of the reservation (e.g., 'confirmed', 'pending', 'cancelled')
);

-- Trigger to reassign the staff_id in reservations when a user (staff member) is deleted
DELIMITER //

CREATE TRIGGER before_user_delete
BEFORE DELETE ON Users
FOR EACH ROW
BEGIN
    -- Reassign the reservations to another staff member
    UPDATE reservation
    SET staff_id = (SELECT id FROM Users LIMIT 1)  -- Here, you can specify the logic for choosing the new staff member
    WHERE staff_id = OLD.id;                       -- Update reservations that have the deleted staff_id
END //

DELIMITER ;





















