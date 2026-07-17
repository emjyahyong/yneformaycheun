package com.api.yneformaycheun.controller;

import com.api.yneformaycheun.dto.TagDto;
import com.api.yneformaycheun.service.TagService;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Liste des tags de l'utilisateur connecté. */
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
}
