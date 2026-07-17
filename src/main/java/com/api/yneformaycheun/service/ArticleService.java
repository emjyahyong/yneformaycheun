package com.api.yneformaycheun.service;

import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.repository.ArticleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

/**
 * Fil d'articles de l'utilisateur : recherche paginée filtrée (tag ou source)
 * et détail. Toutes les requêtes sont bornées à l'utilisateur authentifié
 * (contrôle d'accès par e-mail extrait du JWT).
 */
@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public Page<Article> rechercher(String userEmail, Long tagId, Long sourceId, Pageable pageable) {
        if (tagId != null) {
            return articleRepository
                    .findBySourceUserEmailAndTagsIdOrderByDatePublicationDesc(userEmail, tagId, pageable);
        }
        if (sourceId != null) {
            return articleRepository
                    .findBySourceUserEmailAndSourceIdOrderByDatePublicationDesc(userEmail, sourceId, pageable);
        }
        return articleRepository
                .findBySourceUserEmailOrderByDatePublicationDesc(userEmail, pageable);
    }

    public Article recupererPourUtilisateur(Long id, String userEmail) {
        return articleRepository.findByIdAndSourceUserEmail(id, userEmail)
                .orElseThrow(() -> new AccessDeniedException("Article inaccessible"));
    }
}
