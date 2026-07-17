package com.api.yneformaycheun.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.BatchSize;

/**
 * Article récupéré depuis un flux RSS. La contrainte d'unicité
 * {@code (source_id, url)} interdit tout doublon lors d'un refetch — elle est
 * déclarée à la fois ici (JPA) et côté Liquibase, redondance volontaire.
 */
@Entity
@Table(name = "article",
        uniqueConstraints = @UniqueConstraint(name = "uk_article_source_url",
                columnNames = {"source_id", "url"}))
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "source_id")
    private Source source;

    @Column(nullable = false, length = 500)
    private String titre;

    @Column(nullable = false, length = 2048)
    private String url;

    @Column(name = "contenu_resume", columnDefinition = "text")
    private String contenuResume;

    @Column(name = "date_publication")
    private Instant datePublication;

    @Column(name = "date_creation_en_bd", nullable = false, updatable = false, insertable = false)
    private Instant dateCreationEnBd;

    @ManyToMany
    @JoinTable(name = "article_tag",
            joinColumns = @JoinColumn(name = "article_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @BatchSize(size = 50) // limite le N+1 lors du chargement des tags d'une page d'articles
    private Set<Tag> tags = new HashSet<>();

    protected Article() { } // requis par JPA

    public Article(Source source, String titre, String url,
                   String contenuResume, Instant datePublication) {
        this.source = source;
        this.titre = titre;
        this.url = url;
        this.contenuResume = contenuResume;
        this.datePublication = datePublication;
    }

    public Long getId() {
        return id;
    }

    public Source getSource() {
        return source;
    }

    public String getTitre() {
        return titre;
    }

    public String getUrl() {
        return url;
    }

    public String getContenuResume() {
        return contenuResume;
    }

    public Instant getDatePublication() {
        return datePublication;
    }

    public Instant getDateCreationEnBd() {
        return dateCreationEnBd;
    }

    public Set<Tag> getTags() {
        return tags;
    }
}
