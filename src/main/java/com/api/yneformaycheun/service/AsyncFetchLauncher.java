package com.api.yneformaycheun.service;

import com.api.yneformaycheun.repository.SourceRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Déclenche le fetch d'une source en arrière-plan (thread séparé), pour ne pas
 * bloquer la réponse HTTP lors de l'ajout d'une source. Composant distinct de
 * {@link FetchService} afin que l'annotation {@code @Async} soit prise en compte
 * par le proxy Spring (pas d'auto-invocation).
 */
@Component
public class AsyncFetchLauncher {

    private final SourceRepository sourceRepository;
    private final FetchService fetchService;

    public AsyncFetchLauncher(SourceRepository sourceRepository, FetchService fetchService) {
        this.sourceRepository = sourceRepository;
        this.fetchService = fetchService;
    }

    @Async
    public void lancer(Long sourceId) {
        sourceRepository.findById(sourceId).ifPresent(fetchService::fetch);
    }
}
