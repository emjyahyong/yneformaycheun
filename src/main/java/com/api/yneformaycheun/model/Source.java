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
 * Flux RSS suivi par un utilisateur. Une source appartient à un unique
 * utilisateur (relation portée par la clé étrangère {@code user_id}).
 */
@Entity
@Table(name = "source")
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "url_rss", nullable = false, length = 2048)
    private String urlRss;

    @Column(length = 255)
    private String titre;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "date_dernier_fetch")
    private Instant dateDernierFetch;

    @Column(name = "statut_fetch", length = 20)
    private String statutFetch;

    protected Source() { } // requis par JPA

    public Source(User user, String urlRss, String titre) {
        this.user = user;
        this.urlRss = urlRss;
        this.titre = titre;
    }

    /** Vrai si la source appartient à l'utilisateur identifié par son e-mail. */
    public boolean appartientA(String userEmail) {
        return user != null && user.getEmail().equals(userEmail);
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getUrlRss() {
        return urlRss;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDateDernierFetch() {
        return dateDernierFetch;
    }

    public void setDateDernierFetch(Instant dateDernierFetch) {
        this.dateDernierFetch = dateDernierFetch;
    }

    public String getStatutFetch() {
        return statutFetch;
    }

    public void setStatutFetch(String statutFetch) {
        this.statutFetch = statutFetch;
    }
}
