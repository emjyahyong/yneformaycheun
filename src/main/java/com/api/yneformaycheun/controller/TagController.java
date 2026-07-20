package com.api.yneformaycheun.controller;

import com.api.yneformaycheun.dto.TagCreationDto;
import com.api.yneformaycheun.dto.TagDto;
import com.api.yneformaycheun.model.Tag;
import com.api.yneformaycheun.service.TagService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Gestion des tags de l'utilisateur connecté (création, listing, modification, suppression). */
@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public List<TagDto> lister(Authentication auth) {
        return tagService.listerPourUtilisateur(auth.getName())
                .stream().map(TagDto::from).toList();
    }

    @PostMapping
    public ResponseEntity<TagDto> creer(@Valid @RequestBody TagCreationDto dto, Authentication auth) {
        Tag tag = tagService.creer(dto.nom(), dto.couleur(), auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(TagDto.from(tag));
    }

    @PutMapping("/{id}")
    public TagDto modifier(@PathVariable Long id, @Valid @RequestBody TagCreationDto dto,
                           Authentication auth) {
        Tag tag = tagService.modifier(id, dto.nom(), dto.couleur(), auth.getName());
        return TagDto.from(tag);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id, Authentication auth) {
        tagService.supprimer(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
