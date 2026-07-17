package com.api.yneformaycheun.exception;

/** Levée lorsqu'une URL de flux RSS soumise n'est pas valide. */
public class InvalidRssUrlException extends RuntimeException {

    public InvalidRssUrlException(String url) {
        super("URL de flux RSS invalide : " + url);
    }
}
