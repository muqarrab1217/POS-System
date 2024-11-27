package com.example.demo.repository;

import com.example.demo.model.Item;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.dao.DataAccessException;

import java.math.BigDecimal;
import java.util.ArrayList;
@Repository
public class ItemRepository {

    private final JdbcTemplate jdbcTemplate;

    // Constructor injection of JdbcTemplate
    public ItemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Item> findAll() {
        String sql = "SELECT i.* " +
                     "FROM items i " +
                     "JOIN inventory inv ON i.item_id = inv.item_id"; // Ensure only items in inventory are selected
        
        try {
            // Query the database and return the results
            return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Item.class));
        } catch (DataAccessException e) {
            // Log the error or handle it appropriately
            System.err.println("Error while fetching items: " + e.getMessage());
            // You can rethrow the exception or return an empty list depending on your use case
            return new ArrayList<>(); // Or handle it as per your needs
        }
    }
    

    // Find an item by ID
    public Optional<Item> findById(Long id) {
        String sql = "SELECT * FROM items WHERE item_id = ?"; // SQL to find an item by its ID
        try {
            // Using queryForObject to fetch the item, if exists
            Item item = jdbcTemplate.queryForObject(sql, new Object[]{id}, new BeanPropertyRowMapper<>(Item.class));
            return Optional.of(item);
        } catch (Exception e) {
            // If no item is found, return Optional.empty()
            return Optional.empty();
        }
    }

    // Optionally, you can add custom queries. For example, finding by item name
    public List<Item> findByName(String name) {
        String sql = "SELECT * FROM items WHERE name LIKE ?";
        return jdbcTemplate.query(sql, new Object[]{"%" + name + "%"}, new BeanPropertyRowMapper<>(Item.class));
    }
    
    public void save(Item item) {
        try {
            // Check if the item already exists in the database by name (or another unique attribute)
            String checkExistenceSql = "SELECT COUNT(*) FROM items WHERE name = ?";
            int count = jdbcTemplate.queryForObject(checkExistenceSql, new Object[]{item.getName()}, Integer.class);

            if (count > 0) {
                // If the item already exists, do not insert it again
                System.out.println("Item with name '" + item.getName() + "' already exists.");
            } else {
                // Item doesn't exist, proceed with insertion
                String sql = "INSERT INTO items (name, description, item_path, price, category) VALUES (?, ?, ?, ?, ?)";
                jdbcTemplate.update(sql, item.getName(), item.getDescription(), item.getItemPath(), item.getPrice(), item.getCategory());
                System.out.println("Item added successfully: " + item.getName());
            }
        } catch (Exception e) {
            // Catch any exception that occurs and print a message or rethrow it
            System.err.println("Error adding item: " + e.getMessage());
            throw new RuntimeException("Error adding item: " + e.getMessage(), e); // Optionally rethrow the exception
        }
    }
    
    // Method to update both the item price and inventory (location & quantity) in a single transaction
    public void updateItemAndInventory(Long itemId, BigDecimal newUnitPrice, String newStockLocation, int newQuantity) {
        try {
            // Update Unit Price in the items table
            String updateItemSql = "UPDATE items SET price = ? WHERE item_id = ?";
            jdbcTemplate.update(updateItemSql, newUnitPrice, itemId);
            System.out.println("Updated item price for item_id: " + itemId);

            // Update Stock Location in the inventory table
            String updateLocationSql = "UPDATE inventory SET location = ? WHERE item_id = ?";
            jdbcTemplate.update(updateLocationSql, newStockLocation, itemId);
            System.out.println("Updated stock location for item_id: " + itemId);

            // Update Quantity in the inventory table
            String updateQuantitySql = "UPDATE inventory SET quantity = ? WHERE item_id = ?";
            jdbcTemplate.update(updateQuantitySql, newQuantity, itemId);
            System.out.println("Updated quantity for item_id: " + itemId);

        } catch (Exception e) {
            // Rollback the transaction automatically due to @Transactional if any query fails
            System.err.println("Error while updating item and inventory: " + e.getMessage());
            throw new RuntimeException("Error while updating item and inventory: " + e.getMessage(), e);
        }
    }




  
}
