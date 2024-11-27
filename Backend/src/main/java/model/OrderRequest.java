package com.example.demo.model;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

public class OrderRequest {

    private Long staffId;             // ID of the staff member responsible for the order
    private Timestamp orderDate;      // Date of the order
    private BigDecimal discount;      // Discount on the order
    private String paymentMethod;     // Payment method
    private BigDecimal totalAmount;   // Total amount
    private List<OrderDetail> orderDetails;  // List of order details
    private String tableName;         // Name of the table being reserved (instead of tableId)
    private String customerPhoneNumber; // Phone number for customer reference (optional)

    // Default constructor
    public OrderRequest() {}

    // Constructor with all fields
    public OrderRequest(Long staffId, Timestamp orderDate, BigDecimal discount, String paymentMethod, 
                        BigDecimal totalAmount, List<OrderDetail> orderDetails, String tableName, 
                        String customerPhoneNumber) {
        this.staffId = staffId;
        this.orderDate = orderDate;
        this.discount = discount;
        this.paymentMethod = paymentMethod;
        this.totalAmount = totalAmount;
        this.orderDetails = orderDetails;
        this.tableName = tableName;
        this.customerPhoneNumber = customerPhoneNumber;
    }

    // Getter and Setter for staffId
    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    // Getter and Setter for orderDate
    public Timestamp getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Timestamp orderDate) {
        this.orderDate = orderDate;
    }

    // Getter and Setter for discount
    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    // Getter and Setter for paymentMethod
    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    // Getter and Setter for totalAmount
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    // Getter and Setter for orderDetails
    public List<OrderDetail> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }

    // Getter and Setter for tableName
    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    // Getter and Setter for customerPhoneNumber
    public String getCustomerPhoneNumber() {
        return customerPhoneNumber;
    }

    public void setCustomerPhoneNumber(String customerPhoneNumber) {
        this.customerPhoneNumber = customerPhoneNumber;
    }

    // Override toString() method for better readability
    @Override
    public String toString() {
        return "OrderRequest{" +
                "staffId=" + staffId +
                ", orderDate=" + orderDate +
                ", discount=" + discount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", totalAmount=" + totalAmount +
                ", orderDetails=" + orderDetails +
                ", tableName='" + tableName + '\'' +
                ", customerPhoneNumber='" + customerPhoneNumber + '\'' +
                '}';
    }
}
