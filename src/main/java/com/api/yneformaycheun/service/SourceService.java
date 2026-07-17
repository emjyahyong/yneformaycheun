package com.api.yneformaycheun.service;

import com.api.yneformaycheun.dto.SourceCreationDto;
import com.api.yneformaycheun.exception.InvalidRssUrlException;
import com.api.yneformaycheun.exception.SourceIntrouvableException;
import com.api.yneformaycheun.model.Source;
import com.api.yneformaycheun.model.User;
import com.api.yneformaycheun.repository.SourceRepository;
import com.api.yneformaycheun.repository.UserRepository;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Gestion des sources RSS d'un utilisateur : création (avec validation d'URL),
 * listing et suppression contrôlée par propriétaire.
 */
@Service
public class SourceService {

    private final SourceRepository sourceRepository;
    private final UserRepository userRepository;
    private final UrlValidator urlValidator;
    private final AsyncFetchLauncher fetchLauncher;
    private final FetchService fetchService;

    public SourceService(SourceRepository sourceRepository, UserRepository userRepository,
                         UrlValidator urlValidator, AsyncFetchLauncher fetchLauncher,
                         FetchService fetchService) {
        this.sourceRepository = sourceRepository;
        this.userRepository = userRepository;
        this.urlValidator = urlValidator;
        this.fetchLauncher = fetchLauncher;
        this.fetchService = fetchService;
    }

    @Transactional
    public Source creer(SourceCreationDto dto, String userEmail) {
        if (!urlValidator.isValidRssUrl(dto.urlRss())) {
            throw new InvalidRssUrlException(dto.urlRss());
        }
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AccessDeniedException("Utilisateur inconnu"));
        Source source = new Source(user, dto.urlRss().trim(), dto.titre());
        Source enregistree = sourceRepository.save(source);
        // Fetch immédiat en arrière-plan : les articles apparaissent en quelques
        // secondes sans attendre le prochain fetch planifié.
        fetchLauncher.lancer(enregistree.getId());
        return enregistree;
    }

    /** Force le fetch d'une source de l'utilisateur (déclenchement manuel). */
    @Transactional
    public Source rafraichir(Long sourceId, String userEmail) {
        Source source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new SourceIntrouvableException(sourceId));
        if (!source.appartientA(userEmail)) {
            throw new AccessDeniedException("Source d'un autre utilisateur");
        }
        fetchService.fetch(source);
        return source;
    }

    public List<Source> listerPourUtilisateur(String userEmail) {
        return sourceRepository.findByUserEmail(userEmail);
    }

    @Transactional
    public void supprimer(Long sourceId, String userEmail) {
        Source source = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new SourceIntrouvableException(sourceId));
        if (!source.appartientA(userEmail)) {
            throw new AccessDeniedException("Source d'un autre utilisateur");
        }
        sourceRepository.delete(source);
    }
}
