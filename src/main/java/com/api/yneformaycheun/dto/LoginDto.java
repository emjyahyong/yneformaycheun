package com.api.yneformaycheun.dto;

import jakarta.validation.constraints.NotBlank;

/** Données d'authentification (connexion). */
public record LoginDto(
        @NotBlank String email,
        @NotBlank String password) {
}
