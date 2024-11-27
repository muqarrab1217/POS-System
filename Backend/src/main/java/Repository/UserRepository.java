package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    // Constructor injection of JdbcTemplate
    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Find user by email
    public User findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";

        try {
            // Querying for a single object (expecting one result or none)
            return jdbcTemplate.queryForObject(
                    sql, 
                    new Object[]{email}, 
                    new BeanPropertyRowMapper<>(User.class)
            );
        } catch (EmptyResultDataAccessException e) {
            // If no user is found, return null
            return null;
        }
    }
    

    public void saveUser(User user) {
        // Encrypt the password using BCrypt
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encryptedPassword = passwordEncoder.encode(user.getPassword());

        // Insert the user data with encrypted password
        String sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, user.getName(), user.getEmail(), encryptedPassword, user.getRole());
    }


    // Example of a method to save a user
    /*
    public void saveUser(User user) {
        String sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, user.getName(), user.getEmail(), user.getPassword(), user.getRole());
    }*/

    // Method to fetch all users (example)
    public List<User> findAllUsers() {
        String sql = "SELECT * FROM users";
        return jdbcTemplate.query(
                sql, 
                new BeanPropertyRowMapper<>(User.class)
        );
    }
    
    public List<User> getUsers() {
        String sql = "SELECT username, email, password, role\r\n"
        		+ "FROM Users\r\n"
        		+ "ORDER BY role ASC, username ASC;\r\n"
        		+ ""; // SQL query to get users

        // Using JdbcTemplate to execute the query and map the result to the User model
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            User user = new User();
            user.setName(rs.getString("username"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setRole(rs.getString("role"));
            return user;
        });
    }
    
    public String findRoleByEmail(String email) {
        String sql = "SELECT role FROM users WHERE email = ?"; // SQL query to find the role by email

        try {
            // Query the database and fetch the role as a String
            return jdbcTemplate.queryForObject(sql, new Object[]{email}, String.class);
        } catch (EmptyResultDataAccessException e) {
            // If no result is found (no user with that email), return null
            return null;
        }
    }
    
    public Long findIdByEmail(String email) {
        String sql = "SELECT id FROM users WHERE email = ?"; // SQL query to find the user id by email

        try {
            // Query the database and fetch the id as a Long
            return jdbcTemplate.queryForObject(sql, new Object[]{email}, Long.class);
        } catch (EmptyResultDataAccessException e) {
            // If no result is found (no user with that email), return null
            return null;
        }
    }
    
    public int deleteUserByEmail(String email) {
        try {
            String sql = "DELETE FROM users WHERE email = ?";
            // Execute the query and return the number of rows affected (deleted users)
            return jdbcTemplate.update(sql, email);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error in UserRepository while deleting user with email " + email + ": " + e.getMessage());
            throw new RuntimeException("Error deleting user with email " + email, e);
        }
    }
    
    public long calculateTotalStaff(String role) {
        String sql = "SELECT COUNT(id) FROM users WHERE role = ?";
        
        // Using JdbcTemplate to execute the query and get the count
        return jdbcTemplate.queryForObject(sql, new Object[]{role}, Long.class);
    }
}
