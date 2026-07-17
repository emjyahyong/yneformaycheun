package com.api.yneformaycheun.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.Source;
import com.api.yneformaycheun.model.User;
import com.api.yneformaycheun.repository.ArticleRepository;
import com.api.yneformaycheun.repository.SourceRepository;
import com.rometools.rome.feed.synd.SyndContentImpl;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndEntryImpl;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.feed.synd.SyndFeedImpl;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * Tests unitaires du dédoublonnage et de la résilience du fetch. La lecture du
 * flux est simulée via {@link FeedReader} : aucun accès réseau réel.
 */
@ExtendWith(MockitoExtension.class)
class FetchServiceTest {

    @Mock
    ArticleRepository articleRepository;
    @Mock
    SourceRepository sourceRepository;
    @Mock
    FeedReader feedReader;
    @InjectMocks
    FetchService fetchService;

    private static Source uneSource() {
        User user = new User("user@test.fr", "user", "hash");
        return new Source(user, "https://example.com/rss", "Exemple");
    }

    private static SyndEntry uneEntree(String titre, String lien) {
        SyndEntry entree = new SyndEntryImpl();
        entree.setTitle(titre);
        entree.setLink(lien);
        SyndContentImpl contenu = new SyndContentImpl();
        contenu.setValue("<p>Résumé <b>HTML</b></p>");
        entree.setDescription(contenu);
        entree.setPublishedDate(new Date());
        return entree;
    }

    private static SyndFeed feedAvec(SyndEntry... entrees) {
        SyndFeed feed = new SyndFeedImpl();
        feed.setFeedType("rss_2.0");
        List<SyndEntry> liste = new ArrayList<>();
        for (SyndEntry e : entrees) {
            liste.add(e);
        }
        feed.setEntries(liste);
        return feed;
    }

    @Test
    void unRefetchDuMemeFluxNeCreePasDeDoublon() throws Exception {
        Source source = uneSource();
        when(feedReader.read(anyString()))
                .thenReturn(feedAvec(uneEntree("T1", "https://example.com/a1")));
        when(articleRepository.findBySourceAndUrl(eq(source), anyString()))
                .thenReturn(Optional.of(new Article(source, "T1", "https://example.com/a1", "", null)));

        fetchService.fetch(source);

        verify(articleRepository, never()).save(any());
        assertEquals("succes", source.getStatutFetch());
    }

    @Test
    void unNouvelArticleEstCreeEtNettoye() throws Exception {
        Source source = uneSource();
        when(feedReader.read(anyString()))
                .thenReturn(feedAvec(uneEntree("T1", "https://example.com/a1")));
        when(articleRepository.findBySourceAndUrl(eq(source), anyString()))
                .thenReturn(Optional.empty());

        fetchService.fetch(source);

        verify(articleRepository, times(1)).save(any(Article.class));
        assertEquals("succes", source.getStatutFetch());
    }

    @Test
    void uneEntreeSansLienEstIgnoree() throws Exception {
        Source source = uneSource();
        when(feedReader.read(anyString()))
                .thenReturn(feedAvec(uneEntree("SansLien", null)));

        fetchService.fetch(source);

        verify(articleRepository, never()).findBySourceAndUrl(any(), anyString());
        verify(articleRepository, never()).save(any());
    }

    @Test
    void unEchecDeLectureMetLeStatutEnEchec() throws Exception {
        Source source = uneSource();
        when(feedReader.read(anyString())).thenThrow(new RuntimeException("réseau indisponible"));

        fetchService.fetch(source);

        assertEquals("echec", source.getStatutFetch());
        verify(sourceRepository, times(1)).save(source);
    }
}
