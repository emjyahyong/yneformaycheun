package com.api.yneformaycheun.dto;

/** Réponse renvoyée après authentification réussie : le jeton JWT. */
public record AuthResponse(String token, String type) {

    public static AuthResponse bearer(String token) {
        return new AuthResponse(token, "Bearer");
    }
}
