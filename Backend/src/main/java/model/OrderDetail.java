package com.example.demo.model;

import java.math.BigDecimal;

public class OrderDetail {

    private Long orderDetailsId;
    private Long orderId;        // Order ID (foreign key to Orders table)
    private Long itemId;         // Item ID (foreign key to Items table)
    private Long customerId;     // Customer ID (foreign key to Customers table)
    private String customerNumber;  // Customer Number (new field to accept from frontend)
    private int quantity;        // Quantity of the item
    private BigDecimal price;    // Price of the item at the time of the order

    // Default constructor
    public OrderDetail() {}

    // Getters and Setters
    public Long getOrderDetailsId() {
        return orderDetailsId;
    }

    public void setOrderDetailsId(Long orderDetailsId) {
        this.orderDetailsId = orderDetailsId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerNumber() {
        return customerNumber;
    }

    public void setCustomerNumber(String customerNumber) {
        this.customerNumber = customerNumber;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
