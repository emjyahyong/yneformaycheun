package com.api.yneformaycheun.controller;

import com.api.yneformaycheun.dto.NoteCreationDto;
import com.api.yneformaycheun.dto.UserNoteDto;
import com.api.yneformaycheun.model.UserNote;
import com.api.yneformaycheun.service.UserNoteService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Ajout d'une note personnelle sur un article. */
@RestController
@RequestMapping("/api/articles/{articleId}/notes")
public class UserNoteController {

    private final UserNoteService service;

    public UserNoteController(UserNoteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UserNoteDto> ajouter(@PathVariable Long articleId,
                                               @Valid @RequestBody NoteCreationDto dto,
                                               Authentication auth) {
        UserNote note = service.ajouter(articleId, dto.contenu(), auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(UserNoteDto.from(note));
    }

    @GetMapping
    public List<UserNoteDto> lister(@PathVariable Long articleId, Authentication auth) {
        return service.lister(articleId, auth.getName())
                .stream().map(UserNoteDto::from).toList();
    }
}
