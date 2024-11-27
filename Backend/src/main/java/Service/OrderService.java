package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.model.Order;
import com.example.demo.model.OrderDetail;
import com.example.demo.repository.OrderRepository;

import java.util.List;
import com.example.demo.model.*;
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Method to fetch the next available order number
    public Long getNextOrderNumber() {
        Long maxOrderId = orderRepository.findMaxOrderId();
        return (maxOrderId == null) ? 1L : maxOrderId + 1;
    }

 // Method to place an order (save the order and order details)
    @Transactional
    public void saveOrderAndDetails(Order order, List<OrderDetail> orderDetails, String tableName, Payment payment) {
        try {
            // Step 1: Save the Order
            String orderSql = "INSERT INTO Orders (order_date, discount, payment_method, total_amount, staff_id, status) " +
                              "VALUES (?, ?, ?, ?, ?, ?)";
            orderRepository.saveOrder(order, orderSql);

            // Step 2: Get the generated order_id and update the orderDetails with it
            Long generatedOrderId = orderRepository.findMaxOrderId();

            Long custID = null;
            
            // Step 3: Save each OrderDetail
            for (OrderDetail detail : orderDetails) {
                // Fetch the customerId based on the customerNumber
                Long customerId = orderRepository.getCustomerIdByCustomerNumber(detail.getCustomerNumber());

                // If customerId is null, it means no customer exists with that number, so create a new customer
                if (customerId == null) {
                    customerId = orderRepository.createCustomer(detail.getCustomerNumber());
                }

                // Set the fetched or created customerId in the OrderDetail
                detail.setCustomerId(customerId);
                detail.setOrderId(generatedOrderId);

                // Save the OrderDetail
                String orderDetailSql = "INSERT INTO OrderDetails (order_id, item_id, customer_id, quantity, price) " +
                                        "VALUES (?, ?, ?, ?, ?)";
                orderRepository.saveOrderDetail(detail, orderDetailSql);
                System.out.print("Item id :" + detail.getItemId());
                System.out.print("Quantity id :" + detail.getQuantity());
                
                boolean inventoryupdated = orderRepository.updateInventory(detail.getItemId(),detail.getQuantity());
                if(!inventoryupdated)
                {
                	System.out.print("Error updated inventory" + detail.getItemId());
                }
                custID = customerId;
            }

         // Step 4: Handle Table Reservation if a table is provided
            if (tableName != null && !tableName.isEmpty()) {
                if (orderRepository.isTableAvailable(tableName)) {
                    // Update reservation with customerId, staffId, and orderId
                    orderRepository.updateReservation(generatedOrderId, tableName, custID, order.getStaffId()); // Update the reservation
                } else {
                    throw new RuntimeException("The table is not available for reservation.");
                }
            }


            // Step 5: Insert the payment if provided
            if (payment != null) {
                orderRepository.insertPayment(generatedOrderId, payment.getAmount(), payment.getPaymentMethod());  // Insert payment
            }

        } catch (Exception e) {
            System.out.println("Error while saving order and details: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Error while saving order and details", e);
        }
    }
  
    public List<OrderDTO> getOrderData() {
        return orderRepository.getOrderData();  // Delegate the DB query to the repository
    }
    
    public boolean updateOrderStatus(Long orderId, String status) {
        try {
            // First, check and update the table status to 'not reserved' if necessary
            boolean tableStatusUpdated = orderRepository.updateTableStatusToNotReserved(orderId);

            // Now update the order status in the Orders table
            boolean orderStatusUpdated = orderRepository.updateOrderStatus(orderId, status);

            // Return true if both the table and order statuses were updated
            return tableStatusUpdated || orderStatusUpdated;
        } catch (Exception e) {
            // Log the error (this could be done using a logging framework like SLF4J or Log4J)
            System.err.println("Error updating order and table status: " + e.getMessage());
            // Optionally, you can throw the exception or return false depending on your error handling strategy
            return false;
        }
    }

    
    
    public List<CustomerOrderHistoryDTO> findAllCustomerOrderHistory() {
        try {
            // Fetch the customer order history from the repository
            return orderRepository.findAllCustomerOrderHistory();
        } catch (Exception e) {
            // Log the error and rethrow it
            System.err.println("Error in Service Layer: " + e.getMessage());
            e.printStackTrace(System.err);
            throw new RuntimeException("Error fetching customer order history", e);
        }
    }
    
    public List<TopSellingItemDTO> getTopSellingItems() {
        return orderRepository.findTopSellingItems();
    }
    
    public Double getTotalSales() {
        return orderRepository.calculateTotalSales();
    }
    
    public Object getOrdersTodayandPending() {
        return orderRepository.calculateOrdersToday();
    }
    
    public List<StaffOrderDTO> getTopStaff() {
        return orderRepository.getTopStaff();
    }
    
    public List<Reservation> findReservationsByCustomerIdIsNullAndStatusNotReserved() {
        try {
            // Fetch the reservations from the repository
            return orderRepository.findByCustomerIdIsNullAndStatusNotReserved();
        } catch (Exception e) {
            // Log the error and rethrow it
            System.err.println("Error in Service Layer: " + e.getMessage());
            e.printStackTrace(System.err);
            throw new RuntimeException("Error fetching reservations", e);
        }
    }

}
