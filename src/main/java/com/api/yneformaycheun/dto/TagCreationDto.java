package com.api.yneformaycheun.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Données d'entrée pour la création ou la modification d'un tag. */
public record TagCreationDto(
        @NotBlank(message = "Le nom du tag ne peut pas être vide")
        @Size(max = 100, message = "Nom trop long")
        String nom,

        @Size(max = 20, message = "Couleur trop longue")
        String couleur) {
}
