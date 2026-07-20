package com.api.yneformaycheun.controller;

import com.api.yneformaycheun.dto.ArticleDto;
import com.api.yneformaycheun.service.TagService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Association et dissociation d'un tag sur un article. */
@RestController
@RequestMapping("/api/articles/{articleId}/tags")
public class ArticleTagController {

    private final TagService tagService;

    public ArticleTagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping("/{tagId}")
    public ArticleDto attacher(@PathVariable Long articleId, @PathVariable Long tagId, Authentication auth) {
        return tagService.attacher(articleId, tagId, auth.getName());
    }

    @DeleteMapping("/{tagId}")
    public ArticleDto detacher(@PathVariable Long articleId, @PathVariable Long tagId, Authentication auth) {
        return tagService.detacher(articleId, tagId, auth.getName());
    }
}
