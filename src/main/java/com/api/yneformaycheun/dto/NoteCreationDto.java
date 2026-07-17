package com.api.yneformaycheun.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Données d'entrée pour l'ajout d'une note personnelle sur un article. */
public record NoteCreationDto(
        @NotBlank(message = "Le contenu de la note ne peut pas être vide")
        @Size(max = 5000, message = "Note trop longue")
        String contenu) {
}
