package com.api.yneformaycheun.service;

import com.api.yneformaycheun.dto.ArticleDto;
import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.repository.ArticleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Fil d'articles de l'utilisateur : recherche paginée filtrée (tag ou source)
 * et détail. Toutes les requêtes sont bornées à l'utilisateur authentifié
 * (contrôle d'accès par e-mail extrait du JWT).
 *
 * <p>Le mapping vers {@link ArticleDto} est réalisé dans la transaction du
 * service (méthodes {@code @Transactional}) : la collection {@code tags} (LAZY)
 * est ainsi initialisée pendant que la session Hibernate est ouverte, ce qui
 * évite toute {@code LazyInitializationException} au moment de la sérialisation
 * (l'application est configurée avec {@code open-in-view=false}).
 */
@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @Transactional(readOnly = true)
    public Page<ArticleDto> rechercher(String userEmail, Long tagId, Long sourceId, Pageable pageable) {
        return rechercherEntites(userEmail, tagId, sourceId, pageable).map(ArticleDto::from);
    }

    @Transactional(readOnly = true)
    public ArticleDto recupererPourUtilisateur(Long id, String userEmail) {
        Article article = articleRepository.findByIdAndSourceUserEmail(id, userEmail)
                .orElseThrow(() -> new AccessDeniedException("Article inaccessible"));
        return ArticleDto.from(article);
    }

    private Page<Article> rechercherEntites(String userEmail, Long tagId, Long sourceId, Pageable pageable) {
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
}
