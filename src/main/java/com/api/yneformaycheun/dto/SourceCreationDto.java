package com.api.yneformaycheun.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Données d'entrée pour la création d'une source RSS. */
public record SourceCreationDto(
        @NotBlank(message = "L'URL du flux RSS est obligatoire")
        @Size(max = 2048, message = "URL trop longue")
        String urlRss,

        @Size(max = 255, message = "Titre trop long")
        String titre) {
}
