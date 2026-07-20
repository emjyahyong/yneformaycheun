package com.api.yneformaycheun.controller;

import com.api.yneformaycheun.dto.ArticleDto;
import com.api.yneformaycheun.service.ArticleALireService;
import com.api.yneformaycheun.service.ArticleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Fil d'articles agrégés de l'utilisateur connecté. */
@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;
    private final ArticleALireService articleALireService;

    public ArticleController(ArticleService articleService, ArticleALireService articleALireService) {
        this.articleService = articleService;
        this.articleALireService = articleALireService;
    }

    @GetMapping
    public Page<ArticleDto> lister(@RequestParam(required = false) Long tag,
                                   @RequestParam(required = false) Long source,
                                   @PageableDefault(size = 20) Pageable pageable,
                                   Authentication auth) {
        return articleService.rechercher(auth.getName(), tag, source, pageable);
    }

    @GetMapping("/a-lire")
    public Page<ArticleDto> listerALire(@PageableDefault(size = 20) Pageable pageable, Authentication auth) {
        return articleALireService.lister(auth.getName(), pageable);
    }

    @GetMapping("/{id}")
    public ArticleDto detail(@PathVariable Long id, Authentication auth) {
        return articleService.recupererPourUtilisateur(id, auth.getName());
    }
}
