package com.progra.auth.controller;

import com.progra.auth.model.User;
import com.progra.auth.service.AuthService;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AuthController {
    private static final String SESSION_KEY = "LOGGED_USER";
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    public record RegisterRequest(String fullName, String email, String username, String password) {}
    public record LoginRequest(String username, String password) {}
    public record UserDto(String id, String username, String fullName, String email) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req, HttpSession session) {
        if (req.fullName() == null || req.fullName().isBlank()
                || req.email() == null || req.email().isBlank()
                || req.username() == null || req.username().isBlank()
                || req.password() == null || req.password().length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please complete all fields (password min 8 chars)"));
        }

        try {
            User created = authService.register(req.fullName(), req.email(), req.username(), req.password());
            UserDto dto = toDto(created);
            session.setAttribute(SESSION_KEY, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("user", dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to create account"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession session) {
        if (req.username() == null || req.username().isBlank() || req.password() == null || req.password().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
        }

        try {
            User user = authService.login(req.username(), req.password());
            UserDto dto = toDto(user);
            session.setAttribute(SESSION_KEY, dto);
            return ResponseEntity.ok(Map.of("user", dto));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Authentication service unavailable"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object user = session.getAttribute(SESSION_KEY);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }
        return ResponseEntity.ok(Map.of("user", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("ok", true));
    }

    private UserDto toDto(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getFullName(), user.getEmail());
    }
}
