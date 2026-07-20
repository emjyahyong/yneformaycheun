package com.api.yneformaycheun.service;

import com.api.yneformaycheun.dto.ArticleDto;
import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.ArticleALire;
import com.api.yneformaycheun.model.User;
import com.api.yneformaycheun.repository.ArticleALireRepository;
import com.api.yneformaycheun.repository.ArticleRepository;
import com.api.yneformaycheun.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Marque "à lire plus tard" : un utilisateur peut marquer/démarquer un article
 * accessible via ses sources et consulter la liste de ses articles marqués.
 */
@Service
public class ArticleALireService {

    private final ArticleALireRepository articleALireRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public ArticleALireService(ArticleALireRepository articleALireRepository,
                               ArticleRepository articleRepository,
                               UserRepository userRepository) {
        this.articleALireRepository = articleALireRepository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void marquer(Long articleId, String userEmail) {
        if (articleALireRepository.findByArticleIdAndUserEmail(articleId, userEmail).isPresent()) {
            return; // déjà marqué : opération idempotente
        }
        Article article = articleRepository.findByIdAndSourceUserEmail(articleId, userEmail)
                .orElseThrow(() -> new AccessDeniedException("Article inaccessible"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AccessDeniedException("Utilisateur inconnu"));
        articleALireRepository.save(new ArticleALire(user, article));
    }

    @Transactional
    public void demarquer(Long articleId, String userEmail) {
        articleALireRepository.findByArticleIdAndUserEmail(articleId, userEmail)
                .ifPresent(articleALireRepository::delete);
    }

    public boolean estMarque(Long articleId, String userEmail) {
        return articleALireRepository.findByArticleIdAndUserEmail(articleId, userEmail).isPresent();
    }

    @Transactional(readOnly = true)
    public Page<ArticleDto> lister(String userEmail, Pageable pageable) {
        return articleALireRepository.findByUserEmailOrderByDateAjoutDesc(userEmail, pageable)
                .map(marque -> ArticleDto.from(marque.getArticle()));
    }
}
