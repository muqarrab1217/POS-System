INSERT INTO users (username, email, password, role) 
VALUES 
('john_doe', 'john.doe@example.com', 'password123', 'admin'),
('jane_smith', 'jane.smith@example.com', 'password456', 'user'),
('alice_jones', 'alice.jones@example.com', 'password789', 'moderator');


-- Insert sample data into the Items table
INSERT INTO Items (name, description, item_path, price, category)
VALUES 
    ('Burger', 'A delicious cheeseburger with lettuce, cheese, and tomato.', '/images/burger.png', 5.99, 'FastFood'),
    ('Pizza', 'A large pepperoni pizza with extra cheese.', '/images/pizza.png', 12.99, 'FastFood'),
    ('Soda', 'Refreshing cola drink.', '/images/soda.png', 1.99, 'Drinks'),
    ('Salad', 'Fresh vegetable salad with vinaigrette.', '/images/salad.png', 4.99, 'FastFood'),
    ('Fries', 'Crispy golden fries.', '/images/fries.png', 2.99, 'FastFood'),
    ('Ice Cream', 'A sweet and creamy vanilla ice cream with chocolate syrup.', '/images/icecream.png', 3.99, 'Desert');




-- Insert sample data into the Reports table
INSERT INTO Reports (report_name, report_path)
VALUES 
    ('Monthly Sales Report', '/reports/monthly_sales.pdf'),
    ('Yearly Financial Report', '/reports/yearly_financial.pdf'),
    ('Customer Feedback Report', '/reports/customer_feedback.pdf');

-- Insert sample data into the Orders table
INSERT INTO Orders (order_date, discount, payment_method, total_amount, staff_id, status)
VALUES 
    ('2024-11-20 10:00:00', 5.00, 'cash', 20.99, 1, 'completed'),
    ('2024-11-20 12:30:00', 2.00, 'credit_card', 15.99, 2, 'pending'),
    ('2024-11-20 14:45:00', 0.00, 'cash', 8.99, 3, 'completed'),
    ('2024-11-20 16:00:00', 3.00, 'credit_card', 18.99, 1, 'pending');

INSERT INTO Customers (phone_number) 
VALUES 
    ('123-456-7890'),  -- Customer 1
    ('234-567-8901'),  -- Customer 2
    ('345-678-9012'),  -- Customer 3
    ('456-789-0123');  -- Customer 4


-- Insert sample data into the OrderDetails table
INSERT INTO OrderDetails (order_id, item_id, quantity, price, customer_id)
VALUES 
    (1, 1, 2, 5.99, 1),  -- Order #1, 2 Burgers for Customer 1
    (1, 3, 1, 1.99, 1),  -- Order #1, 1 Soda for Customer 1
    (2, 2, 1, 12.99, 2), -- Order #2, 1 Pizza for Customer 2
    (2, 4, 1, 4.99, 2),  -- Order #2, 1 Salad for Customer 2
    (3, 5, 1, 2.99, 3),  -- Order #3, 1 Fries for Customer 3
    (4, 2, 1, 12.99, 4), -- Order #4, 1 Pizza for Customer 4
    (4, 5, 1, 2.99, 4);  -- Order #4, 1 Fries for Customer 4


-- Insert sample data into the Inventory table
-- Insert data into Inventory, letting the created_at field auto-generate the timestamp
INSERT INTO Inventory (item_id, quantity, location)
VALUES 
    (1, 100, 'Warehouse A'), -- 100 Burgers in stock
    (2, 50, 'Warehouse B'),  -- 50 Pizzas in stock
    (3, 200, 'Store 1'),     -- 200 Sodas in stock
    (4, 75, 'Store 1'),      -- 75 Salads in stock
    (5, 150, 'Warehouse A'), -- 150 Fries in stock
    (6, 50, 'Warehouse B');  -- 50 of Item 6 in stock


-- Insert sample data into the Payments table
INSERT INTO Payments (order_id, payment_date, payment_method, amount)
VALUES 
    (1, '2024-11-20 10:30:00', 'cash', 20.99), -- Payment for Order #1
    (2, '2024-11-20 12:45:00', 'credit_card', 15.99), -- Payment for Order #2
    (3, '2024-11-20 14:50:00', 'cash', 8.99), -- Payment for Order #3
    (4, '2024-11-20 16:10:00', 'credit_card', 18.99); -- Payment for Order #4
    
INSERT INTO reservation (table_name, status, customer_id, staff_id, order_id) 
VALUES 
    ('Regular 1', 'not reserved', null, 1, null),
    ('Regular 2', 'reserved', 2, 1, 1),
    ('Regular 3', 'not reserved', null, 2, null),
    ('Regular 4', 'reserved', 4, 2, 2),
    ('Regular 5', 'not reserved', null, 3, 3),
    ('Regular 6', 'reserved', 1, 3, 4),
    ('Regular 7', 'not reserved', null, 1, null),
    ('Regular 8', 'not reserved', null, 1, null),
    ('Premium 1', 'reserved', 3, 2, 3),
    ('Premium 2', 'not reserved', null, 3, null);

SELECT SUM(o.total_amount - o.discount) AS total_sales
FROM Orders o
WHERE o.status = 'completed';

SELECT 
    COUNT(o.order_id) AS total_orders_today,
    COUNT(CASE WHEN o.status = 'pending' THEN 1 END) AS pending_orders_today
FROM Orders o



select * from users;
select * from items;
select * from orders;
select * from customers;
select * from OrderDetails;
select * from inventory;
select * from reservation;
select * from payments;
select * from reports;
