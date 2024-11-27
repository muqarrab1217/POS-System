package com.example.demo.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class CustomerOrderHistoryDTO {

    private String customerNumber;  // Customer phone number
    private Long orderId;           // Order ID
    private String staffName;       // Name of the staff who handled the order
    private String items;           // Items in the order (concatenated list of item names and quantities)
    private String status;          // Order status
    private BigDecimal totalAmount; // Total amount of the order
    private Timestamp date;         // Order date

    // Getters and setters
    public String getCustomerNumber() {
        return customerNumber;
    }

    public void setCustomerNumber(String customerNumber) {
        this.customerNumber = customerNumber;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getItems() {
        return items;
    }

    public void setItems(String items) {
        this.items = items;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }
}
