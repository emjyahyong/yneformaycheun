package com.api.yneformaycheun.repository;

import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.Source;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    /** Recherche d'un article existant pour le dédoublonnage au fetch. */
    Optional<Article> findBySourceAndUrl(Source source, String url);

    /** Fil d'articles de l'utilisateur, filtré par tag, trié par date. */
    Page<Article> findBySourceUserEmailAndTagsIdOrderByDatePublicationDesc(
            String userEmail, Long tagId, Pageable pageable);

    /** Fil d'articles de l'utilisateur, filtré par source, trié par date. */
    Page<Article> findBySourceUserEmailAndSourceIdOrderByDatePublicationDesc(
            String userEmail, Long sourceId, Pageable pageable);

    /** Fil d'articles complet de l'utilisateur, trié par date. */
    Page<Article> findBySourceUserEmailOrderByDatePublicationDesc(
            String userEmail, Pageable pageable);

    /** Détail d'un article, borné à l'utilisateur propriétaire de la source. */
    Optional<Article> findByIdAndSourceUserEmail(Long id, String userEmail);
}
