package com.progra.auth.service;

import com.progra.auth.model.User;
import com.progra.auth.model.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String fullName, String email, String username, String password) {
        String cleanUsername = username.trim().toLowerCase();
        String cleanEmail = email.trim().toLowerCase();

        if (userRepository.findByUsername(cleanUsername) != null) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.findByEmail(cleanEmail) != null) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String hash = passwordEncoder.encode(password);
        User newUser = new User(fullName.trim(), cleanEmail, cleanUsername, hash);
        return userRepository.save(newUser);
    }

    public User login(String username, String password) {
        String cleanUsername = username.trim().toLowerCase();
        User user = userRepository.findByUsername(cleanUsername);

        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new SecurityException("Invalid username or password");
        }
        return user;
    }
}
