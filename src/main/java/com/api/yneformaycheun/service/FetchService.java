package com.api.yneformaycheun.service;

import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.Source;
import com.api.yneformaycheun.repository.ArticleRepository;
import com.api.yneformaycheun.repository.SourceRepository;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import java.time.Instant;
import java.util.Optional;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Agrégation des articles d'un flux RSS : parsing (ROME), nettoyage HTML
 * (Jsoup), dédoublonnage sur {@code (source, url)}. Le try/catch/finally
 * garantit que {@code statut_fetch} est toujours mis à jour, y compris en cas
 * d'échec réseau ou de parsing — sans jamais interrompre le fetch des autres
 * sources.
 */
@Service
public class FetchService {

    private static final Logger log = LoggerFactory.getLogger(FetchService.class);

    private final SourceRepository sourceRepository;
    private final ArticleRepository articleRepository;
    private final FeedReader feedReader;

    public FetchService(SourceRepository sourceRepository,
                        ArticleRepository articleRepository,
                        FeedReader feedReader) {
        this.sourceRepository = sourceRepository;
        this.articleRepository = articleRepository;
        this.feedReader = feedReader;
    }

    @Transactional
    public void fetch(Source source) {
        try {
            SyndFeed feed = feedReader.read(source.getUrlRss());

            for (SyndEntry entree : feed.getEntries()) {
                // Vérification défensive : certains flux non standards omettent
                // le lien de l'entrée.
                if (entree.getLink() == null || entree.getLink().isBlank()) {
                    continue;
                }
                String resume = entree.getDescription() != null
                        ? Jsoup.clean(entree.getDescription().getValue(), Safelist.basic())
                        : "";
                Optional<Article> existant = articleRepository
                        .findBySourceAndUrl(source, entree.getLink());
                if (existant.isEmpty()) {
                    articleRepository.save(new Article(source, entree.getTitle(),
                            entree.getLink(), resume, toInstant(entree)));
                }
            }
            source.setStatutFetch("succes");
        } catch (Exception e) {
            log.warn("Échec du fetch de la source {} : {}", source.getUrlRss(), e.getMessage());
            source.setStatutFetch("echec");
        } finally {
            source.setDateDernierFetch(Instant.now());
            sourceRepository.save(source);
        }
    }

    private static Instant toInstant(SyndEntry entree) {
        return entree.getPublishedDate() != null
                ? entree.getPublishedDate().toInstant()
                : null;
    }
}
