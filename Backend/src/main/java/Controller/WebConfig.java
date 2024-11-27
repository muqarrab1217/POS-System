package com.example.demo.Controller;  // Adjust the package based on your project structure

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration  // This annotation tells Spring Boot that this is a configuration class
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow CORS requests from your frontend
        registry.addMapping("/**")  // Apply CORS to all endpoints
                .allowedOrigins("http://localhost:3000")  // Allow requests from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allow these HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true);  // Allow cookies to be sent with requests if needed
    }
}
