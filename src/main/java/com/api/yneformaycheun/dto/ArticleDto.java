package com.api.yneformaycheun.dto;

import com.api.yneformaycheun.model.Article;
import java.time.Instant;
import java.util.List;

/** Projection d'un article, exposant sa relation N:N vers les tags. */
public record ArticleDto(Long id, String titre, String url, String resume,
                         Instant datePublication, String sourceNom, List<TagDto> tags) {

    public static ArticleDto from(Article article) {
        return new ArticleDto(article.getId(), article.getTitre(), article.getUrl(),
                article.getContenuResume(), article.getDatePublication(),
                article.getSource().getTitre(),
                article.getTags().stream().map(TagDto::from).toList());
    }
}
