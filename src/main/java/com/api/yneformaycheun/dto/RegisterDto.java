package com.api.yneformaycheun.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Données d'inscription d'un nouvel utilisateur. */
public record RegisterDto(
        @NotBlank @Email(message = "E-mail invalide") String email,

        @NotBlank @Size(max = 100, message = "Nom d'utilisateur trop long") String username,

        @NotBlank
        @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
        String password) {
}
