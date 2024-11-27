package com.example.demo.Service;

import com.example.demo.model.Item;
import com.example.demo.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.math.BigDecimal;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    //GetAllItems
    public List<Item> getAllItems() {
        List<Item> items = itemRepository.findAll();
        System.out.println("Fetched items: " + items);  // Logs the list of items to console
        return items;
    }


    // Get an item by ID (if needed for detailed view)
    public Item getItemById(Long id) {
        return itemRepository.findById(id).orElse(null); // Returns null if not found
    }
    
 // ItemService.java
    public void addItem(Item item) {
        itemRepository.save(item);  // Save item to the 'items' table
    }
    
    
    public void updateItemAndInventory(Long itemId, BigDecimal newUnitPrice, String newStockLocation, int newQuantity) {
        // Call repository method to update both the item price and the inventory
        itemRepository.updateItemAndInventory(itemId, newUnitPrice, newStockLocation, newQuantity);
    }
}
