package com.example.demo.model;

import java.math.BigDecimal;
import java.sql.Timestamp;  // Import Timestamp

public class OrderDTO {

    private Long orderId;
    private String staffName;
    private String customerNumber;
    private String status;
    private BigDecimal totalAmount;
    private Timestamp orderDate;  // Added orderDate field

    // Getters and Setters

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

    public String getCustomerNumber() {
        return customerNumber;
    }

    public void setCustomerNumber(String customerNumber) {
        this.customerNumber = customerNumber;
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

    public Timestamp getOrderDate() {
        return orderDate;  // Getter for orderDate
    }

    public void setOrderDate(Timestamp orderDate) {
        this.orderDate = orderDate;  // Setter for orderDate
    }
}
