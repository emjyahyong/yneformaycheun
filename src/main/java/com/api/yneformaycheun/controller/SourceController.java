package com.api.yneformaycheun.controller;

import com.api.yneformaycheun.dto.SourceCreationDto;
import com.api.yneformaycheun.dto.SourceDto;
import com.api.yneformaycheun.model.Source;
import com.api.yneformaycheun.service.SourceService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Gestion des sources RSS de l'utilisateur connecté. */
@RestController
@RequestMapping("/api/sources")
public class SourceController {

    private final SourceService sourceService;

    public SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }

    @PostMapping
    public ResponseEntity<SourceDto> ajouter(@Valid @RequestBody SourceCreationDto dto,
                                             Authentication auth) {
        Source source = sourceService.creer(dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(SourceDto.from(source));
    }

    @GetMapping
    public List<SourceDto> lister(Authentication auth) {
        return sourceService.listerPourUtilisateur(auth.getName())
                .stream().map(SourceDto::from).toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id, Authentication auth) {
        sourceService.supprimer(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
