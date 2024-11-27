package com.example.demo.model;

import java.math.BigDecimal;

public class Payment {

    private BigDecimal amount;  // Amount of payment
    private String paymentMethod;  // Payment method (e.g., 'credit card', 'cash', etc.)

    // Constructor to initialize the payment object
    public Payment(BigDecimal amount, String paymentMethod) {
        this.amount = amount;
        this.paymentMethod = paymentMethod;
    }

    // Getters and Setters
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "amount=" + amount +
                ", paymentMethod='" + paymentMethod + '\'' +
                '}';
    }
}
