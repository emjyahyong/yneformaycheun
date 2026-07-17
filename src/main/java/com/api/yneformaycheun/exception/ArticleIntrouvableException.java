package com.api.yneformaycheun.exception;

/** Levée lorsqu'un article demandé n'existe pas. */
public class ArticleIntrouvableException extends RuntimeException {

    public ArticleIntrouvableException(Long id) {
        super("Article introuvable : " + id);
    }
}
