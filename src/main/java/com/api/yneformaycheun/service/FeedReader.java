package com.api.yneformaycheun.service;

import com.rometools.rome.feed.synd.SyndFeed;

/**
 * Abstraction de la lecture d'un flux RSS/Atom. Isole la dépendance réseau
 * (ROME) pour rendre {@link FetchService} testable sans appel externe réel.
 */
public interface FeedReader {

    SyndFeed read(String urlRss) throws Exception;
}
