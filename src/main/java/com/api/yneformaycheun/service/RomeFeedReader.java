package com.api.yneformaycheun.service;

import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import java.io.InputStream;
import java.net.URI;
import java.net.URLConnection;
import org.springframework.stereotype.Component;

/**
 * Implémentation par défaut de {@link FeedReader} basée sur la librairie ROME,
 * qui normalise les variantes de flux (RSS 2.0, Atom) derrière une seule API.
 */
@Component
public class RomeFeedReader implements FeedReader {

    @Override
    public SyndFeed read(String urlRss) throws Exception {
        URLConnection connexion = URI.create(urlRss).toURL().openConnection();
        connexion.setConnectTimeout(10_000);
        connexion.setReadTimeout(10_000);
        try (InputStream flux = connexion.getInputStream();
                XmlReader reader = new XmlReader(flux)) {
            return new SyndFeedInput().build(reader);
        }
    }
}
