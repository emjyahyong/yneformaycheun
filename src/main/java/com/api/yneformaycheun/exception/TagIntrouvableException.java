package com.api.yneformaycheun.exception;

/** Levée lorsqu'un tag demandé n'existe pas ou n'appartient pas à l'utilisateur. */
public class TagIntrouvableException extends RuntimeException {

    public TagIntrouvableException(Long id) {
        super("Tag introuvable : " + id);
    }
}
