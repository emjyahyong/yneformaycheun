package com.api.yneformaycheun.service;

import com.api.yneformaycheun.dto.ArticleDto;
import com.api.yneformaycheun.exception.TagIntrouvableException;
import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.Tag;
import com.api.yneformaycheun.model.User;
import com.api.yneformaycheun.repository.ArticleRepository;
import com.api.yneformaycheun.repository.TagRepository;
import com.api.yneformaycheun.repository.UserRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Gestion des tags (création, modification, suppression) et de leur
 * association aux articles. Le filtrage est borné à l'utilisateur : demander
 * un tag d'un autre utilisateur renvoie une page vide ou une 404 selon le cas,
 * jamais une fuite inter-utilisateur.
 */
@Service
public class TagService {

    private final TagRepository tagRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public TagService(TagRepository tagRepository, ArticleRepository articleRepository,
                      UserRepository userRepository) {
        this.tagRepository = tagRepository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    public List<Tag> listerPourUtilisateur(String userEmail) {
        return tagRepository.findByUserEmail(userEmail);
    }

    public Page<Article> filtrerParTag(String userEmail, Long tagId, Pageable pageable) {
        return articleRepository
                .findBySourceUserEmailAndTagsIdOrderByDatePublicationDesc(userEmail, tagId, pageable);
    }

    @Transactional
    public Tag creer(String nom, String couleur, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AccessDeniedException("Utilisateur inconnu"));
        return tagRepository.save(new Tag(user, nom.trim(), couleur));
    }

    @Transactional
    public Tag modifier(Long tagId, String nom, String couleur, String userEmail) {
        Tag tag = tagRepository.findByIdAndUserEmail(tagId, userEmail)
                .orElseThrow(() -> new TagIntrouvableException(tagId));
        tag.setNom(nom.trim());
        tag.setCouleur(couleur);
        return tag;
    }

    @Transactional
    public void supprimer(Long tagId, String userEmail) {
        Tag tag = tagRepository.findByIdAndUserEmail(tagId, userEmail)
                .orElseThrow(() -> new TagIntrouvableException(tagId));
        tagRepository.delete(tag);
    }

    /**
     * Attache un tag à un article. L'article et le tag doivent tous deux
     * appartenir à l'utilisateur authentifié. Le mapping vers {@link ArticleDto}
     * est réalisé ici, dans la transaction, pour éviter toute
     * LazyInitializationException (open-in-view=false).
     */
    @Transactional
    public ArticleDto attacher(Long articleId, Long tagId, String userEmail) {
        Article article = articleRepository.findByIdAndSourceUserEmail(articleId, userEmail)
                .orElseThrow(() -> new AccessDeniedException("Article inaccessible"));
        Tag tag = tagRepository.findByIdAndUserEmail(tagId, userEmail)
                .orElseThrow(() -> new TagIntrouvableException(tagId));
        article.getTags().add(tag);
        return ArticleDto.from(article);
    }

    /** Détache un tag d'un article. */
    @Transactional
    public ArticleDto detacher(Long articleId, Long tagId, String userEmail) {
        Article article = articleRepository.findByIdAndSourceUserEmail(articleId, userEmail)
                .orElseThrow(() -> new AccessDeniedException("Article inaccessible"));
        Tag tag = tagRepository.findByIdAndUserEmail(tagId, userEmail)
                .orElseThrow(() -> new TagIntrouvableException(tagId));
        article.getTags().remove(tag);
        return ArticleDto.from(article);
    }
}
