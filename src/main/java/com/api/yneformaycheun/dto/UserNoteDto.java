package com.api.yneformaycheun.dto;

import com.api.yneformaycheun.model.UserNote;
import java.time.Instant;

/** Projection immuable d'une note personnelle exposée par l'API. */
public record UserNoteDto(Long id, Long articleId, String contenu, Instant timestamp) {

    public static UserNoteDto from(UserNote note) {
        return new UserNoteDto(note.getId(), note.getArticle().getId(),
                note.getContenuNote(), note.getTimestamp());
    }
}
