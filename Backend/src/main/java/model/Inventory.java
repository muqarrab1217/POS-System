package com.example.demo.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Inventory {

    private Long itemId;
    private String itemName;
    private BigDecimal unitPrice;
    private String stockLocation;
    private Integer quantity;
    private LocalDateTime stockedDate; // New field for stocked date

    // Getters and Setters
    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getStockLocation() {
        return stockLocation;
    }

    public void setStockLocation(String stockLocation) {
        this.stockLocation = stockLocation;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getStockedDate() {
        return stockedDate;
    }

    public void setStockedDate(LocalDateTime stockedDate) {
        this.stockedDate = stockedDate;
    }
}
