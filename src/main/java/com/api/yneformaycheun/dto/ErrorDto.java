package com.api.yneformaycheun.dto;

/** Format d'erreur JSON homogène renvoyé par l'API. */
public record ErrorDto(String code, String message) {
}
