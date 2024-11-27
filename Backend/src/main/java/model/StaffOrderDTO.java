package com.example.demo.model;

public class StaffOrderDTO {
    private String staffName;
    private int totalOrders;

    // Constructor
    public StaffOrderDTO(String staffName, int totalOrders) {
        this.staffName = staffName;
        this.totalOrders = totalOrders;
    }

    // Getters and setters
    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }
}
