package com.api.yneformaycheun.controller;

import com.api.yneformaycheun.dto.ArticleALireStatutDto;
import com.api.yneformaycheun.service.ArticleALireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Marque "à lire plus tard" sur un article donné. */
@RestController
@RequestMapping("/api/articles/{articleId}/a-lire")
public class ArticleALireController {

    private final ArticleALireService service;

    public ArticleALireController(ArticleALireService service) {
        this.service = service;
    }

    @GetMapping
    public ArticleALireStatutDto statut(@PathVariable Long articleId, Authentication auth) {
        return new ArticleALireStatutDto(service.estMarque(articleId, auth.getName()));
    }

    @PostMapping
    public ResponseEntity<Void> marquer(@PathVariable Long articleId, Authentication auth) {
        service.marquer(articleId, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> demarquer(@PathVariable Long articleId, Authentication auth) {
        service.demarquer(articleId, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
