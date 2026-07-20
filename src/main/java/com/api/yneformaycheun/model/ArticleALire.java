package com.api.yneformaycheun.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

/** Marque "à lire plus tard" posée par un utilisateur sur un article. */
@Entity
@Table(name = "article_a_lire",
        uniqueConstraints = @UniqueConstraint(name = "uk_article_a_lire_user_article",
                columnNames = {"user_id", "article_id"}))
public class ArticleALire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "article_id")
    private Article article;

    @Column(name = "date_ajout", nullable = false, updatable = false, insertable = false)
    private Instant dateAjout;

    protected ArticleALire() { } // requis par JPA

    public ArticleALire(User user, Article article) {
        this.user = user;
        this.article = article;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Article getArticle() {
        return article;
    }

    public Instant getDateAjout() {
        return dateAjout;
    }
}
