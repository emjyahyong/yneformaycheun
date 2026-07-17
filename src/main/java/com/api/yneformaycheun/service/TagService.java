package com.api.yneformaycheun.service;

import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.Tag;
import com.api.yneformaycheun.repository.ArticleRepository;
import com.api.yneformaycheun.repository.TagRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Gestion des tags et filtrage des articles par tag. Le filtrage est borné à
 * l'utilisateur : demander un tag d'un autre utilisateur renvoie une page vide
 * (pas de fuite inter-utilisateur), jamais une erreur.
 */
@Service
public class TagService {

    private final TagRepository tagRepository;
    private final ArticleRepository articleRepository;

    public TagService(TagRepository tagRepository, ArticleRepository articleRepository) {
        this.tagRepository = tagRepository;
        this.articleRepository = articleRepository;
    }

    public List<Tag> listerPourUtilisateur(String userEmail) {
        return tagRepository.findByUserEmail(userEmail);
    }

    public Page<Article> filtrerParTag(String userEmail, Long tagId, Pageable pageable) {
        return articleRepository
                .findBySourceUserEmailAndTagsIdOrderByDatePublicationDesc(userEmail, tagId, pageable);
    }
}
