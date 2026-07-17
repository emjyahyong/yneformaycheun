package com.api.yneformaycheun.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.api.yneformaycheun.dto.SourceCreationDto;
import com.api.yneformaycheun.exception.InvalidRssUrlException;
import com.api.yneformaycheun.model.Source;
import com.api.yneformaycheun.model.User;
import com.api.yneformaycheun.repository.SourceRepository;
import com.api.yneformaycheun.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

/** Tests unitaires + sécurité du service des sources. */
@ExtendWith(MockitoExtension.class)
class SourceServiceTest {

    @Mock
    SourceRepository sourceRepository;
    @Mock
    UserRepository userRepository;
    @Mock
    UrlValidator urlValidator;
    @InjectMocks
    SourceService sourceService;

    @Test
    void uneUrlInvalideEstRejeteeAvantToutAcces() {
        when(urlValidator.isValidRssUrl("mauvaise")).thenReturn(false);
        SourceCreationDto dto = new SourceCreationDto("mauvaise", "Titre");

        assertThrows(InvalidRssUrlException.class,
                () -> sourceService.creer(dto, "user@test.fr"));
        verify(sourceRepository, never()).save(any());
    }

    @Test
    void laSuppressionEstRefuseeSiLUtilisateurNEstPasProprietaire() {
        User proprietaire = new User("proprio@test.fr", "proprio", "hash");
        Source source = new Source(proprietaire, "https://x.fr/rss", "X");
        when(sourceRepository.findById(1L)).thenReturn(Optional.of(source));

        assertThrows(AccessDeniedException.class,
                () -> sourceService.supprimer(1L, "intrus@test.fr"));
        verify(sourceRepository, never()).delete(any());
    }

    @Test
    void laSuppressionReussitPourLeProprietaire() {
        User proprietaire = new User("proprio@test.fr", "proprio", "hash");
        Source source = new Source(proprietaire, "https://x.fr/rss", "X");
        when(sourceRepository.findById(1L)).thenReturn(Optional.of(source));

        sourceService.supprimer(1L, "proprio@test.fr");

        verify(sourceRepository).delete(source);
    }
}
