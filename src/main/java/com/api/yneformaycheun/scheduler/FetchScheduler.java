package com.api.yneformaycheun.scheduler;

import com.api.yneformaycheun.model.Source;
import com.api.yneformaycheun.repository.SourceRepository;
import com.api.yneformaycheun.service.FetchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Déclenche le fetch de toutes les sources à intervalle régulier (horaire).
 * L'échec d'une source n'interrompt jamais le fetch des autres : chaque appel
 * à {@link FetchService#fetch(Source)} gère son propre statut d'erreur.
 */
@Component
public class FetchScheduler {

    private static final Logger log = LoggerFactory.getLogger(FetchScheduler.class);

    private final SourceRepository sourceRepository;
    private final FetchService fetchService;

    public FetchScheduler(SourceRepository sourceRepository, FetchService fetchService) {
        this.sourceRepository = sourceRepository;
        this.fetchService = fetchService;
    }

    /** Toutes les heures (fraîcheur jugée suffisante pour de la veille technologique). */
    @Scheduled(cron = "${app.fetch.cron:0 0 * * * *}")
    public void fetchToutesLesSources() {
        for (Source source : sourceRepository.findAll()) {
            try {
                fetchService.fetch(source);
            } catch (Exception e) {
                // Filet de sécurité : la résilience du fetch ne doit jamais être
                // compromise par une source défaillante.
                log.warn("Fetch planifié en échec pour la source {}", source.getId(), e);
            }
        }
    }
}
