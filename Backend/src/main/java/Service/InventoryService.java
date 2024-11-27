package com.example.demo.Service;

import com.example.demo.model.Inventory;
import com.example.demo.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> getAllInventory() {
        return inventoryRepository.getAllInventory();
    }
    
 // InventoryService.java
    public void addInventory(Inventory inventory) {
        inventoryRepository.save(inventory);  // Save inventory to the 'inventory' table
    }
    
    public void deleteInventoryByItemId(Long itemId) {
        try {
            // Attempt to delete inventory by itemId
            inventoryRepository.deleteByItemId(itemId);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error in InventoryService while deleting inventory for item_id " + itemId + ": " + e.getMessage());
            // Re-throw the exception to be handled by the controller
            throw new RuntimeException("Error deleting inventory for item_id " + itemId, e);
        }
    }
    
    public String updateInventory(Long inventoryId, int quantity, String location) {
        try {
            // Call the repository method to update the inventory
            int rowsUpdated = inventoryRepository.updateInventory(inventoryId, quantity, location);

            if (rowsUpdated > 0) {
                return "Inventory updated successfully!";
            } else {
                return "Inventory update failed, inventory item not found.";
            }
        } catch (Exception e) {
            // Handle any unexpected exceptions
            e.printStackTrace();
            return "Error updating inventory: " + e.getMessage();
        }
    }

   



}
