package com.example.demo.Service;

import com.example.demo.model.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.demo.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;

    // Register a new user
    public String registerUser(User user) {
        // Check if the email already exists
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return "User with this email already exists!";
        }

        // Save the user if the email doesn't exist
        userRepository.saveUser(user);
        return "User registered successfully!";
    }

    public UserService(UserRepository userRepository) {
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.userRepository = userRepository;
    }

    // Login user - compare hashed password with the one stored in the database
    public String loginUser(String email, String enteredPassword) {
        User user = userRepository.findByEmail(email);

        if (user != null && passwordEncoder.matches(enteredPassword, user.getPassword())) {
            return "Login successful!";
        }
        return "Invalid email or password!";
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Long getUserIdByEmail(String email) {
        return userRepository.findIdByEmail(email);
    }
    
    public String getUserRoleByEmail(String email) {
        String role = userRepository.findRoleByEmail(email); // Call the repository method
        if (role == null) {
            throw new RuntimeException("User not found or role does not exist");
        }
        return role; // Return the role if found
    }
    
    public Long getTotalStaff(){
    	return userRepository.calculateTotalStaff("staff member");
    }
    
    public boolean deleteUserByEmail(String email) {
        try {
            // Try to delete user by email
            int deletedCount = userRepository.deleteUserByEmail(email);

            // If no rows were deleted, the user was not found
            return deletedCount > 0;
        } catch (Exception e) {
            // Log the error and rethrow as a runtime exception
            System.err.println("Error in UserService while deleting user with email " + email + ": " + e.getMessage());
            throw new RuntimeException("Error deleting user with email " + email, e);
        }
    }
    
    public List<User> getUsers() {
        // Example logic that simulates checking each user's role or status
        List<User> users = userRepository.getUsers();
        return users;
    }

}
