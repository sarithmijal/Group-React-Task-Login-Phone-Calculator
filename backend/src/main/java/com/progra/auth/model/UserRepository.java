package com.progra.auth.model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestClient;

@Repository
public class UserRepository {
    private final RestClient restClient;

    public UserRepository(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.key}") String supabaseKey) {
        this.restClient = RestClient.builder()
                .baseUrl(supabaseUrl + "/rest/v1")
                .defaultHeader("apikey", supabaseKey)
                .defaultHeader("Authorization", "Bearer " + supabaseKey)
                .build();
    }

    public User findByUsername(String username) {
        User[] users = restClient.get()
                .uri("/users?username=eq.{username}&select=id,full_name,email,username,password_hash", username)
                .retrieve()
                .body(User[].class);
        return (users != null && users.length > 0) ? users[0] : null;
    }

    public User findByEmail(String email) {
        User[] users = restClient.get()
                .uri("/users?email=eq.{email}&select=id,full_name,email,username", email)
                .retrieve()
                .body(User[].class);
        return (users != null && users.length > 0) ? users[0] : null;
    }

    public User save(User user) {
        User[] created = restClient.post()
                .uri("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Prefer", "return=representation")
                .body(user)
                .retrieve()
                .body(User[].class);
        if (created == null || created.length == 0) {
            throw new IllegalStateException("Failed to save user in Supabase");
        }
        return created[0];
    }
}
