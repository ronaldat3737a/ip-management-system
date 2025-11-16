package com.example.ipmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()  // tắt CSRF cho dev
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/**").permitAll() // cho phép tất cả API /api/**
                .anyRequest().authenticated() // Yêu cầu xác thực cho các request khác
            );
        return http.build();
    }
}
