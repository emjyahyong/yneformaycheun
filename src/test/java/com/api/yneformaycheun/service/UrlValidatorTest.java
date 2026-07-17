package com.api.yneformaycheun.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

/** Tests unitaires de la validation d'URL de flux RSS. */
class UrlValidatorTest {

    private final UrlValidator validator = new UrlValidator();

    @Test
    void uneUrlHttpsValideEstAcceptee() {
        assertTrue(validator.isValidRssUrl("https://example.com/feed.xml"));
    }

    @Test
    void uneUrlHttpValideEstAcceptee() {
        assertTrue(validator.isValidRssUrl("http://blog.example.org/rss"));
    }

    @Test
    void uneChaineVideOuNulleEstRejetee() {
        assertFalse(validator.isValidRssUrl(""));
        assertFalse(validator.isValidRssUrl("   "));
        assertFalse(validator.isValidRssUrl(null));
    }

    @Test
    void unSchemeNonHttpEstRejete() {
        assertFalse(validator.isValidRssUrl("ftp://example.com/feed"));
        assertFalse(validator.isValidRssUrl("javascript:alert(1)"));
    }

    @Test
    void uneUrlRelativeOuMalformeeEstRejetee() {
        assertFalse(validator.isValidRssUrl("/feed.xml"));
        assertFalse(validator.isValidRssUrl("pas une url"));
    }
}
