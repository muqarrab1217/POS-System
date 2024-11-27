-- Delete all rows from the tables before dropping
DELETE FROM Payments;
DELETE FROM Inventory;
DELETE FROM OrderDetails;
DELETE FROM Orders;
DELETE FROM Reports;
DELETE FROM Items;
DELETE FROM Users;

-- Drop Payments table (depends on Orders)
DROP TABLE IF EXISTS Payments;

-- Drop Inventory table (depends on Items)
DROP TABLE IF EXISTS Inventory;

-- Drop OrderDetails table (depends on Orders and Items)
DROP TABLE IF EXISTS OrderDetails;

-- Drop Orders table (depends on Users)
DROP TABLE IF EXISTS Orders;

-- Drop Reports table (no dependencies)
DROP TABLE IF EXISTS Reports;

-- Drop Items table (no dependencies)
DROP TABLE IF EXISTS Items;

-- Drop Users table (no dependencies)
DROP TABLE IF EXISTS Reservation

-- Drop Users table (no dependencies)
DROP TABLE IF EXISTS Users;




DROP TABLE IF EXISTS Customers;

