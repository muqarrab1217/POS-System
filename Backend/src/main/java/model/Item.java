package com.example.demo.model;


public class Item {

    private Long itemId;
    
    private String name;
    private String description;
    private String itemPath; // Path to the image
    private double price;
    private String category;

    // Getters and Setters
    public Long getItemId() {
        return itemId;
    }

    public String getCategory() {
    	return category;
    }
    
    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void setCategory(String cat) {
        this.category = cat;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getItemPath() {
        return itemPath;
    }

    public void setItemPath(String itemPath) {
        this.itemPath = itemPath;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
