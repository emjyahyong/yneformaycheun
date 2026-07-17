package com.api.yneformaycheun.service;

import java.net.URI;
import java.net.URISyntaxException;
import org.springframework.stereotype.Component;

/**
 * Validation d'URL de flux RSS avant tout fetch réseau (défense « Insecure
 * Design » : on ne déclenche jamais un accès réseau sur une entrée non validée).
 */
@Component
public class UrlValidator {

    public boolean isValidRssUrl(String url) {
        if (url == null || url.isBlank()) {
            return false;
        }
        try {
            URI uri = new URI(url.trim());
            String scheme = uri.getScheme();
            return uri.isAbsolute()
                    && ("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme))
                    && uri.getHost() != null && !uri.getHost().isBlank();
        } catch (URISyntaxException e) {
            return false;
        }
    }
}
