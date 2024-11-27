package com.example.demo.model;

public class TopSellingItemDTO {
    
    private String itemName;
    private Long totalOrders;

    public TopSellingItemDTO(String itemName, Long totalOrders) {
        this.itemName = itemName;
        this.totalOrders = totalOrders;
    }

    // Getters and Setters
    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }
}
