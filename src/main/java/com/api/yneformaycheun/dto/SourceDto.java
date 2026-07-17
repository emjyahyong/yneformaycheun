package com.api.yneformaycheun.dto;

import com.api.yneformaycheun.model.Source;
import java.time.Instant;

/** Projection immuable d'une source exposée par l'API (jamais l'entité JPA). */
public record SourceDto(Long id, String urlRss, String titre,
                        String statutFetch, Instant dateDernierFetch) {

    public static SourceDto from(Source source) {
        return new SourceDto(source.getId(), source.getUrlRss(), source.getTitre(),
                source.getStatutFetch(), source.getDateDernierFetch());
    }
}
