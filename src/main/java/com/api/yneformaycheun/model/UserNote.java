package com.api.yneformaycheun.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

/**
 * Note personnelle d'un utilisateur sur un article.
 */
@Entity
@Table(name = "user_note")
public class UserNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "article_id")
    private Article article;

    @Column(name = "contenu_note", columnDefinition = "text")
    private String contenuNote;

    // "timestamp" est un mot réservé : les backticks demandent à Hibernate de
    // le quoter selon le dialecte cible (guillemets doubles en PostgreSQL).
    @Column(name = "`timestamp`", nullable = false, updatable = false, insertable = false)
    private Instant timestamp;

    protected UserNote() { } // requis par JPA

    public UserNote(User user, Article article, String contenuNote) {
        this.user = user;
        this.article = article;
        this.contenuNote = contenuNote;
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

    public String getContenuNote() {
        return contenuNote;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
}
