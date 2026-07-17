package com.api.yneformaycheun.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Étiquette définie par un utilisateur pour organiser ses articles.
 */
@Entity
@Table(name = "tag")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 20)
    private String couleur;

    protected Tag() { } // requis par JPA

    public Tag(User user, String nom, String couleur) {
        this.user = user;
        this.nom = nom;
        this.couleur = couleur;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getNom() {
        return nom;
    }

    public String getCouleur() {
        return couleur;
    }
}
