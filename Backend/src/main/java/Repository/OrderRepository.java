package com.example.demo.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import com.example.demo.model.*;

import java.util.List;
import org.springframework.jdbc.core.RowMapper;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
@Repository
public class OrderRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public OrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Method to save the order and order details together
    public void saveOrder(Order order, String orderSql) {
        jdbcTemplate.update(orderSql, 
                order.getOrderDate(), 
                order.getDiscount(),
                order.getPaymentMethod(), 
                order.getTotalAmount(), 
                order.getStaffId(), 
                order.getStatus());
    }

    // Method to save OrderDetail
    public void saveOrderDetail(OrderDetail detail, String orderDetailSql) {
    	 System.out.println("In repo item id: "+ detail.getItemId());
         System.out.println("In repo item quantity: "+ detail.getItemId());

        jdbcTemplate.update(orderDetailSql,
                detail.getOrderId(),        // order_id (foreign key)
                detail.getItemId(),         // item_id (foreign key)
                detail.getCustomerId(),     // customer_id (foreign key)
                detail.getQuantity(),       // quantity
                detail.getPrice());         // price
    }

    // Method to find the max order_id
    public Long findMaxOrderId() {
        String sql = "SELECT MAX(order_id) FROM orders"; // SQL to find the maximum order_id
        try {
            return jdbcTemplate.queryForObject(sql, Long.class);  // Fetch the result as Long
        } catch (EmptyResultDataAccessException e) {
            // If no rows are found, return null (meaning no orders exist yet)
            return null;
        }
    }
    
    // Method to fetch customerId by customerNumber
    public Long getCustomerIdByCustomerNumber(String customerNumber) {
        String sql = "SELECT customer_id FROM customers WHERE phone_number = ?";
        try {
            return jdbcTemplate.queryForObject(sql, Long.class, customerNumber);
        } catch (EmptyResultDataAccessException e) {
            // If no customer found, return null
            return null;
        }
    }

    // Method to create a new customer if they do not exist
    public Long createCustomer(String customerNumber) {
      
        // Placeholder SQL to insert a new customer (adjust as per your schema)
        String insertSql = "INSERT INTO customers (phone_number) VALUES (?)";
        
        // Insert the new customer and return the generated customer_id
        jdbcTemplate.update(insertSql, customerNumber);
        
        // Fetch the newly generated customer_id (assuming it's auto-incremented)
        String selectSql = "SELECT customer_id FROM customers WHERE phone_number = ?";
        return jdbcTemplate.queryForObject(selectSql, Long.class, customerNumber);
    }
    
    private RowMapper<OrderDTO> orderRowMapper = (rs, rowNum) -> {
        OrderDTO order = new OrderDTO();
        order.setOrderId(rs.getLong("order_id"));
        order.setStaffName(rs.getString("staff_name"));
        order.setCustomerNumber(rs.getString("customer_number"));
        order.setStatus(rs.getString("status"));
        order.setTotalAmount(rs.getBigDecimal("total_amount"));
        order.setOrderDate(rs.getTimestamp("order_date"));  // Map the order_date field
        return order;
    };
    
    public List<OrderDTO> getOrderData() {
        String sql = "SELECT " +
                     "    o.order_id, " +
                     "    u.username AS staff_name, " +
                     "    c.phone_number AS customer_number, " +
                     "    o.status, " +
                     "    o.total_amount, " +
                     "    o.order_date " +  // Select the order_date field
                     "FROM " +
                     "    Orders o " +
                     "JOIN " +
                     "    Users u ON o.staff_id = u.id " +
                     "JOIN " +
                     "    OrderDetails od ON o.order_id = od.order_id " +
                     "JOIN " +
                     "    Customers c ON od.customer_id = c.customer_id " +
                     "GROUP BY " +
                     "    o.order_id, u.username, c.phone_number, o.status, o.total_amount, o.order_date " +  // Group by order_date
                     "ORDER BY " +
                     "    o.order_date DESC";  // Sort by order_date in descending order

        // Query the database and map the result to OrderDTO list using the rowMapper
        return jdbcTemplate.query(sql, orderRowMapper);  // Executes the query and maps the result to a list of OrderDTOs
    }


    
    // Method to update order status
    public boolean updateOrderStatus(Long orderId, String status) {
        String sql = "UPDATE Orders SET status = ? WHERE order_id = ?";

        // Execute the update query using JdbcTemplate
        int rowsAffected = jdbcTemplate.update(sql, status, orderId);

        // Return true if the update was successful (i.e., at least one row affected)
        return rowsAffected > 0;
    }
    
 // Method to check if a table is reserved for the given orderId and update its status to 'not reserved'
    public boolean updateTableStatusToNotReserved(Long orderId) {
        // SQL to check if a reservation exists for the given order_id with status 'reserved'
        String checkReservationSql = "SELECT COUNT(*) FROM reservation WHERE order_id = ? AND status = 'reserved'";

        // Check if the reservation exists
        Integer count = jdbcTemplate.queryForObject(checkReservationSql, Integer.class, orderId);

        // If a reservation exists, update the status to 'not reserved'
        if (count != null && count > 0) {
        	String updateStatusSql = "UPDATE reservation SET status = 'not reserved', customer_id = NULL, order_id = NULL WHERE order_id = ? AND status = 'reserved'";
            
            // Execute the update query
            int rowsAffected = jdbcTemplate.update(updateStatusSql, orderId);

            // Return true if the status update was successful
            return rowsAffected > 0;
        }

        // If no reservation exists, return false (no change made)
        return false;
    }

    
    public List<CustomerOrderHistoryDTO> findAllCustomerOrderHistory() {
        // Updated SQL query to only include completed orders
        String sql = "SELECT " +
                     "    c.phone_number AS customer_number, " +     // Customer's phone number
                     "    o.order_id, " +                           // Order ID
                     "    GROUP_CONCAT(i.name, ' x ', od.quantity ORDER BY i.name) AS items, " +  // Itemized list
                     "    o.total_amount, " +                       // Total amount of the order
                     "    o.order_date " +                          // Order date
                     "FROM " +
                     "    Orders o " +
                     "JOIN " +
                     "    OrderDetails od ON o.order_id = od.order_id " +  // Join Orders and OrderDetails
                     "JOIN " +
                     "    Items i ON od.item_id = i.item_id " +           // Join OrderDetails and Items
                     "JOIN " +
                     "    Customers c ON od.customer_id = c.customer_id " +  // Join OrderDetails and Customers
                     "WHERE " +
                     "    o.status = 'completed' " +  // Filter only completed orders
                     "GROUP BY " +
                     "    c.phone_number, o.order_id, o.total_amount, o.order_date " + // Grouping by customer and order
                     "ORDER BY " +
                     "    o.order_date DESC";  // Order the results by date (newest first)

        try {
            // Log the SQL query for debugging (optional)
            System.out.println("Executing SQL query: " + sql);

            // Execute the query and map the result to CustomerOrderHistoryDTO
            List<CustomerOrderHistoryDTO> orderHistoryList = jdbcTemplate.query(sql, (rs, rowNum) -> {
                CustomerOrderHistoryDTO orderHistory = new CustomerOrderHistoryDTO();
                orderHistory.setCustomerNumber(rs.getString("customer_number"));  // Set customer phone number
                orderHistory.setOrderId(rs.getLong("order_id"));                   // Set order ID
                orderHistory.setItems(rs.getString("items"));                      // Set item list (name x quantity)
                orderHistory.setTotalAmount(rs.getBigDecimal("total_amount"));     // Set total amount
                orderHistory.setDate(rs.getTimestamp("order_date"));               // Set order date
                orderHistory.setStaffName(null);  // Staff name is not included in this query
                orderHistory.setStatus(null);    // Status is not included in this query
                return orderHistory;
            });

            // Return the final list of CustomerOrderHistoryDTOs
            return orderHistoryList;

        } catch (Exception e) {
            // Log and handle the exception
            System.err.println("Error executing the query: " + e.getMessage());
            e.printStackTrace(System.err);  // Print stack trace to standard error
            throw new RuntimeException("Error fetching customer order history", e);
        }
    }
    
    // Custom query to fetch top selling items using JDBC
    public List<TopSellingItemDTO> findTopSellingItems() {
        String sql = "SELECT i.name AS item_name, SUM(od.quantity) AS total_orders " +
                     "FROM OrderDetails od " +
                     "JOIN Items i ON od.item_id = i.item_id " +
                     "GROUP BY i.item_id " +
                     "ORDER BY total_orders DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            // Mapping the ResultSet to the TopSellingItemDTO model
            String itemName = rs.getString("item_name");
            Long totalOrders = rs.getLong("total_orders");
            return new TopSellingItemDTO(itemName, totalOrders);
        });
    }
    
 // Method to get the top staff members with the most orders
    public List<StaffOrderDTO> getTopStaff() {
        String sql = "SELECT u.username AS staff_name, COUNT(o.order_id) AS total_orders " +
                     "FROM Orders o " +
                     "JOIN Users u ON o.staff_id = u.id " +
                     "GROUP BY u.id " +
                     "ORDER BY total_orders DESC";
        
        // Using JdbcTemplate to execute the query and map the result to the DTO
        return jdbcTemplate.query(sql, (rs, rowNum) -> new StaffOrderDTO(
                rs.getString("staff_name"),
                rs.getInt("total_orders")
        ));
    }
    
    public List<Reservation> findByCustomerIdIsNullAndStatusNotReserved() {
        // SQL query to find reservations where customer_id is NULL and status is not 'reserved'
        String sql = "SELECT reservation_id, table_name, customer_id, staff_id, status " +
                     "FROM reservation " +
                     "WHERE customer_id IS NULL AND status != 'reserved'";

        // Execute the query and map the result to a list of Reservation objects
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Reservation.class));
    }
    
    public Double calculateTotalSales() {
        String sql = "SELECT SUM(o.total_amount - o.discount) AS total_sales " +
                     "FROM Orders o " +
                     "WHERE o.status = 'completed'";

        // Query the database and return the total sales value
        return jdbcTemplate.queryForObject(sql, Double.class);
    }
    
    public Object calculateOrdersToday() {
        String sql = "SELECT " +
                     "COUNT(o.order_id) AS total_orders_today, " +
                     "COUNT(CASE WHEN o.status = 'pending' THEN 1 END) AS pending_orders_today " +
                     "FROM Orders o ";

        // Execute the query and return the result as a map
        return jdbcTemplate.queryForMap(sql);
    }
    
    public void updateReservation(Long orderId, String tableName, Long customerId, Long staffId) {
        String sql = "UPDATE reservation SET customer_id = ?, staff_id = ?, order_id = ?, status = 'reserved' WHERE table_name = ?";
        jdbcTemplate.update(sql, customerId, staffId, orderId, tableName);
    }

    // Method to insert payment
    public void insertPayment(Long orderId, BigDecimal amount, String paymentMethod) {
        String sql = "INSERT INTO payments (order_id, amount, payment_method) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, orderId, amount, paymentMethod);
    }
    
	 // Method to check if a table is available for reservation
	    public boolean isTableAvailable(String tableName) {
	        String sql = "SELECT count(*) FROM reservation WHERE table_name = ? AND status != 'reserved'";
	        int count = jdbcTemplate.queryForObject(sql, Integer.class, tableName);
	        return count > 0;
	    }
	    
	 // Method to update the inventory after an order is placed
	    public boolean updateInventory(Long itemId, int quantityOrdered) {
	        // Step 1: Retrieve the current inventory quantity
	        String getQuantitySql = "SELECT quantity FROM Inventory WHERE item_id = ?";
	        Integer currentQuantity = jdbcTemplate.queryForObject(getQuantitySql, Integer.class, itemId);

	        if (currentQuantity == null) {
	            // If no quantity is found for the item, return false (inventory not found)
	            return false;
	        }

	        // Step 2: Calculate the new quantity after subtracting the ordered quantity
	        int newQuantity = currentQuantity - quantityOrdered;

	        if (newQuantity < 0) {
	            // If the new quantity is negative, return false (insufficient inventory)
	            return false;
	        }

	        // Step 3: Update the inventory with the new quantity
	        String updateQuantitySql = "UPDATE Inventory SET quantity = ? WHERE item_id = ?";
	        int rowsAffected = jdbcTemplate.update(updateQuantitySql, newQuantity, itemId);

	        // Return true if the update was successful
	        return rowsAffected > 0;
	    }


    
}
