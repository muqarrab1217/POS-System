package com.example.demo.Controller;

import com.example.demo.model.*;
import com.example.demo.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.math.BigDecimal;  // One-liner import for BigDecimal


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") 

public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private ItemService itemService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private InventoryService inventoryService;
   
    
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        String result = userService.registerUser(user);

        if (result.equals("User registered successfully!")) {
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
        }
    }
    
    @PostMapping("/login")  
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        
        // Authenticate user using the service
        String loginMessage = userService.loginUser(email, password);
        
        if (loginMessage.equals("Login successful!")) {
            // Return 200 OK with success message
            return ResponseEntity.ok(loginMessage);
        }
        
        // Return 401 Unauthorized with error message
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginMessage);
    }
    
    @GetMapping("/getitems")
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        if (items.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no items exist
        }
        return ResponseEntity.ok(items); // Return 200 OK with the list of items
    }

    // Get an item by ID (Optional)
    @GetMapping("/item/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        if (item == null) {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if item doesn't exist
        }
        return ResponseEntity.ok(item); // Return 200 OK with the item details
    }
    
    @GetMapping("/next-order-number")
    public ResponseEntity<Long> getNextOrderNumber() {
        Long nextOrderNumber = orderService.getNextOrderNumber();
        return ResponseEntity.ok(nextOrderNumber); // Return 200 OK with the next order number
    }
    
    @GetMapping("/role")
    public ResponseEntity<String> getUserRoleByEmail(@RequestParam String email) {
        String role = userService.getUserRoleByEmail(email); // Call the service method
        if (role == null) {
            // Handle case where role is not found for the given email
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Role not found for the email: " + email);
        }
        return ResponseEntity.ok(role); // Return the role with a 200 OK response
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("This is the test page.");
    }
    
    @GetMapping("/getUserId")
    public Long getUserIdByEmail(@RequestParam String email) {
        return userService.getUserIdByEmail(email);
    }

    @PostMapping("/place-order")
    public ResponseEntity<String> placeOrder(@RequestBody OrderRequest orderRequest) {
        try {
            // Convert OrderRequest to Order
            Order order = new Order();
            order.setOrderDate(orderRequest.getOrderDate());
            order.setDiscount(orderRequest.getDiscount());
            order.setPaymentMethod(orderRequest.getPaymentMethod());
            order.setTotalAmount(orderRequest.getTotalAmount());
            order.setStaffId(orderRequest.getStaffId());
            order.setStatus("pending");  // Assuming default status is "pending", adjust as needed

            // Create a Payment object
            Payment payment = new Payment(orderRequest.getTotalAmount(), orderRequest.getPaymentMethod());

            // Call service method to save the order and details
            orderService.saveOrderAndDetails(order, orderRequest.getOrderDetails(), orderRequest.getTableName(), payment);

            return ResponseEntity.ok("Order placed successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error placing the order: " + e.getMessage());
        }
    }

    
    @GetMapping("/inventory")
    public ResponseEntity<List<Inventory>> getAllInventory() {
        List<Inventory> inventory = inventoryService.getAllInventory();
        if (inventory.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no inventory
        }
        return ResponseEntity.ok(inventory); // Return 200 OK with inventory list
    }
    
    @PostMapping("/add-inventory")
    public ResponseEntity<String> addItemAndInventory(@RequestBody ItemInventoryRequest request) {
        try {
            // Add Item
            Item item = request.getItem();
            itemService.addItem(item);  // Save item to 'items' table

            // Add Inventory
            Inventory inventory = request.getInventory();
            inventory.setItemId(item.getItemId()); // Link the inventory to the item via itemId
            inventoryService.addInventory(inventory);  // Save inventory to 'inventory' table

            return ResponseEntity.status(HttpStatus.CREATED).body("Item and Inventory added successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding item and inventory: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/delete-inventory/{itemId}")
    public ResponseEntity<String> deleteInventory(@PathVariable Long itemId) {
        try {
            inventoryService.deleteInventoryByItemId(itemId); // Call the service to delete the inventory
            return ResponseEntity.ok("Inventory deleted successfully.");
        } catch (RuntimeException e) {
            // Log the exception if necessary
            System.err.println("Error deleting inventory for item_id " + itemId + ": " + e.getMessage());
            // Return a 500 Internal Server Error with a meaningful message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting inventory: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/delete-user")
    public ResponseEntity<String> deleteUser(@RequestParam String email) {
        try {
            // Call the service to delete user by email
            boolean isDeleted = userService.deleteUserByEmail(email);
            
            if (isDeleted) {
                // Return success response
                return ResponseEntity.ok("User deleted successfully.");
            } else {
                // Return 404 if user not found
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with email: " + email);
            }
        } catch (RuntimeException e) {
            // Log the exception if necessary
            System.err.println("Error deleting user with email " + email + ": " + e.getMessage());
            // Return 500 Internal Server Error with a meaningful message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user: " + e.getMessage());
        }
    }
    
    @PutMapping("/update-item-inventory/{itemId}")
    public ResponseEntity<String> updateItemAndInventory(
            @PathVariable Long itemId,                       // Get itemId from the path
            @RequestParam BigDecimal newUnitPrice,           // Get newUnitPrice from the query string
            @RequestParam String newStockLocation,          // Get newStockLocation from the query string
            @RequestParam int newQuantity)                  // Get newQuantity from the query string
    {
        try {
            // Call the service method to update the item and inventory
            itemService.updateItemAndInventory(itemId, newUnitPrice, newStockLocation, newQuantity);
            return ResponseEntity.ok("Item and Inventory updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error updating item and inventory: " + e.getMessage());
        }
    }

    
    @GetMapping("/manageorders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        try {
            // Fetch order data
            List<OrderDTO> orders = orderService.getOrderData();
            if (orders.isEmpty()) {
                return ResponseEntity.noContent().build(); // Return 204 No Content if no orders
            }
            return ResponseEntity.ok(orders); // Return 200 OK with order data
        } catch (Exception e) {
            // Log the exception if needed
            return ResponseEntity.status(500).body(null); // Internal Server Error if something went wrong
        }
    }
    
    @PutMapping("/update-status/{orderId}")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long orderId,              // Order ID from URL
            @RequestBody Map<String, String> request) // Use Map to receive status in the body
    {
        try {
            String newStatus = request.get("status");  // Extract status from the body
            if (newStatus == null || newStatus.isEmpty()) {
                return ResponseEntity.badRequest().body("Status must be provided.");
            }
            
            // Pass the orderId and the new status to the service
            boolean isUpdated = orderService.updateOrderStatus(orderId, newStatus);
            
            if (isUpdated) {
                return ResponseEntity.ok("Order status updated successfully.");
            } else {
                return ResponseEntity.status(404).body("Order not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating order status: " + e.getMessage());
        }
    }
    
    @GetMapping("/customer-history")
    public ResponseEntity<List<CustomerOrderHistoryDTO>> getCustomerOrderHistory() {
        try {
            // Fetch all customer order histories
            List<CustomerOrderHistoryDTO> orderHistory = orderService.findAllCustomerOrderHistory();
            if (orderHistory.isEmpty()) {
                return ResponseEntity.noContent().build();  // Return 204 if no orders found
            }
            return ResponseEntity.ok(orderHistory);  // Return 200 OK with the order history
        } catch (Exception e) {
            // Log and return error response
            System.err.println("Error in Controller: " + e.getMessage());
            e.printStackTrace(System.err);
            return ResponseEntity.status(500).body(null);  // Return 500 internal server error
        }
    }

    @GetMapping("/top-selling")
    public List<TopSellingItemDTO> getTopSellingItems() {
        return orderService.getTopSellingItems();
    }
    
    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getReservations() {
        try {
            List<Reservation> reservations = orderService.findReservationsByCustomerIdIsNullAndStatusNotReserved();
            if (reservations.isEmpty()) {
                return ResponseEntity.noContent().build(); // Return 204 if no reservations found
            }
            return ResponseEntity.ok(reservations); // Return 200 OK with the list of reservations
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Internal Server Error in case of exception
        }
    }
    
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }
    
    // Endpoint for root URL '/'
    @GetMapping("/")
    public ResponseEntity<String> root() {
        return ResponseEntity.ok("Welcome to the API!");
    }
   
    @GetMapping("/total-sales")
    public Double getTotalSales() {
        return orderService.getTotalSales();
    }
    
    @GetMapping("/orders-today-and-pending")
    public Object getOrdersTodayandPending() {
        return orderService.getOrdersTodayandPending();
    }
    
    @GetMapping("/top-staff")
    public List<StaffOrderDTO> getTopStaff() {
        return orderService.getTopStaff();
    }
    
    @GetMapping("/total-staff")
    public Long getTotalStaff(){
    	return userService.getTotalStaff();
    }

//     Endpoint for '/home'
    @GetMapping("/home")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("This is the home page.");
    }
}
