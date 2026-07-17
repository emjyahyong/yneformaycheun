package com.api.yneformaycheun.service;

import com.api.yneformaycheun.exception.ArticleIntrouvableException;
import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.User;
import com.api.yneformaycheun.model.UserNote;
import com.api.yneformaycheun.repository.ArticleRepository;
import com.api.yneformaycheun.repository.UserNoteRepository;
import com.api.yneformaycheun.repository.UserRepository;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Notes personnelles d'un utilisateur sur un article. L'article doit exister
 * et appartenir, via sa source, à l'utilisateur authentifié.
 */
@Service
public class UserNoteService {

    private final UserNoteRepository repository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public UserNoteService(UserNoteRepository repository, ArticleRepository articleRepository,
                           UserRepository userRepository) {
        this.repository = repository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public UserNote ajouter(Long articleId, String contenu, String userEmail) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleIntrouvableException(articleId));
        // Contrôle d'accès : l'article doit relever d'une source de l'utilisateur.
        if (!article.getSource().appartientA(userEmail)) {
            throw new AccessDeniedException("Article d'un autre utilisateur");
        }
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AccessDeniedException("Utilisateur inconnu"));
        return repository.save(new UserNote(user, article, contenu));
    }

    /** Notes de l'utilisateur sur un article (uniquement les siennes). */
    public List<UserNote> lister(Long articleId, String userEmail) {
        return repository.findByArticleIdAndUserEmail(articleId, userEmail);
    }
}
