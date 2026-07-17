package com.api.yneformaycheun.dto;

import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.Tag;
import java.time.Instant;
import java.util.List;

/** Projection d'un article, aplatissant la relation N:N vers une liste de tags. */
public record ArticleDto(Long id, String titre, String url, String resume,
                         Instant datePublication, String sourceNom, List<String> tags) {

    public static ArticleDto from(Article article) {
        return new ArticleDto(article.getId(), article.getTitre(), article.getUrl(),
                article.getContenuResume(), article.getDatePublication(),
                article.getSource().getTitre(),
                article.getTags().stream().map(Tag::getNom).toList());
    }
}
