package com.api.yneformaycheun.exception;

/** Levée lorsqu'une source demandée n'existe pas. */
public class SourceIntrouvableException extends RuntimeException {

    public SourceIntrouvableException(Long id) {
        super("Source introuvable : " + id);
    }
}
