package com.example.ipmanagement.service;

import com.example.ipmanagement.model.User;
import com.example.ipmanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Default role nếu null
        if (user.getRole() == null) user.setRole("USER");

        return userRepository.save(user);
    }

    public Optional<User> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            System.out.println("Stored hash: " + user.getPassword());
            System.out.println("Provided password: " + password);
            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            } else {
                System.out.println("Password does not match!");
            }
        } else {
            System.out.println("User not found: " + username);
        }
        return Optional.empty();
    }
}
