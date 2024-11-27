package com.example.demo.repository;

import com.example.demo.model.Inventory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import org.springframework.dao.DataAccessException;
import java.math.BigDecimal;

@Repository
public class InventoryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public InventoryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

 // Query to fetch inventory with Item details
    public List<Inventory> getAllInventory() {
        String sql = "SELECT " +
                    "    i.item_id, " +
                    "    i.name AS item_name, " +      
                    "    i.price AS unit_price, " +   
                    "    inv.quantity, " +
                    "    inv.location, " +
                    "    inv.created_at AS stocked_date " +  // Adding created_at as stocked_date
                    "FROM " +
                    "    Inventory inv " +
                    "JOIN " +
                    "    Items i ON inv.item_id = i.item_id;";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Inventory inventory = new Inventory();
            inventory.setItemId(rs.getLong("item_id"));
            inventory.setItemName(rs.getString("item_name"));
            inventory.setUnitPrice(rs.getBigDecimal("unit_price"));
            inventory.setQuantity(rs.getInt("quantity"));
            inventory.setStockLocation(rs.getString("location"));
            
            // Map the stocked_date (created_at) to the LocalDateTime field
            inventory.setStockedDate(rs.getTimestamp("stocked_date").toLocalDateTime());
            
            return inventory;
        });
    }
    
    public void save(Inventory inventory) {
        try {
            // Query to find the itemId using the itemName
            String findItemIdSql = "SELECT item_id FROM items WHERE name = ?";
            
            // Find the itemId based on itemName
            Long itemId = jdbcTemplate.queryForObject(findItemIdSql, new Object[]{inventory.getItemName()}, Long.class);

            if (itemId != null) {
                System.out.println("Item found with ID: " + itemId);

                // Check if inventory already exists for this item and location
                String checkInventorySql = "SELECT COUNT(*) FROM inventory WHERE item_id = ? AND location = ?";
                int count = jdbcTemplate.queryForObject(checkInventorySql, new Object[]{itemId, inventory.getStockLocation()}, Integer.class);

                if (count > 0) {
                    // If inventory already exists for this item at the specified location, throw an error
                    throw new IllegalArgumentException("Inventory for item '" + inventory.getItemName() + "' already exists at location '" + inventory.getStockLocation() + "'.");
                }

                // SQL query to insert inventory data
                String insertInventorySql = "INSERT INTO inventory (item_id, quantity, location) VALUES (?, ?, ?)";

                // Use the itemId to insert the inventory record
                jdbcTemplate.update(insertInventorySql,
                    itemId,                         // item_id (fetched from itemName)
                    inventory.getQuantity(),        // quantity
                    inventory.getStockLocation());  // location

                System.out.println("Inventory for item '" + inventory.getItemName() + "' added successfully.");
            } else {
                throw new IllegalArgumentException("Item with name '" + inventory.getItemName() + "' not found.");
            }
        } catch (Exception e) {
            // Catch any exception and log it
            System.err.println("Error adding inventory: " + e.getMessage());
            // Optionally, you can rethrow the exception or throw a custom exception
            throw new RuntimeException("Error adding inventory for item '" + inventory.getItemName() + "'.", e);
        }
    }
    
    public void deleteByItemId(Long itemId) {
        try {
            // SQL query to delete inventory entry by item_id
            String sql = "DELETE FROM Inventory WHERE item_id = ?";

            // Execute the delete query
            int rowsAffected = jdbcTemplate.update(sql, itemId);

            // Check if any rows were deleted
            if (rowsAffected == 0) {
                throw new RuntimeException("No inventory found for item_id: " + itemId);
            }
        } catch (Exception e) {
            // Log the error (you can use a logger, or just print to console)
            System.err.println("Error deleting inventory for item_id " + itemId + ": " + e.getMessage());
            // Throw a runtime exception to be handled by the service or controller
            throw new RuntimeException("Error deleting inventory for item_id " + itemId, e);
        }
    }
    
    public int updateInventory(Long inventoryId, int quantity, String location) {
        try {
            String sql = "UPDATE inventory SET quantity = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE inventory_id = ?";
            return jdbcTemplate.update(sql, quantity, location, inventoryId);
        } catch (DataAccessException e) {
            // Log the exception (you can use a logger here)
            System.err.println("Error updating inventory: " + e.getMessage());
            throw new RuntimeException("Error updating inventory record: " + e.getMessage(), e);
        }
    }

    

}
