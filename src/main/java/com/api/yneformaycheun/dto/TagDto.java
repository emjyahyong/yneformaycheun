package com.api.yneformaycheun.dto;

import com.api.yneformaycheun.model.Tag;

/** Projection immuable d'un tag exposée par l'API. */
public record TagDto(Long id, String nom, String couleur) {

    public static TagDto from(Tag tag) {
        return new TagDto(tag.getId(), tag.getNom(), tag.getCouleur());
    }
}
