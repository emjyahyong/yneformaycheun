package com.api.yneformaycheun.repository;

import static org.junit.jupiter.api.Assertions.assertThrows;

import com.api.yneformaycheun.AbstractIntegrationTest;
import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.Source;
import com.api.yneformaycheun.model.User;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;

/**
 * Test d'intégration TestContainers : la contrainte UNIQUE(source_id, url)
 * empêche tout doublon au niveau base, en complément de la vérification
 * applicative dans FetchService.
 */
class ArticleRepositoryIT extends AbstractIntegrationTest {

    @Autowired
    ArticleRepository articleRepository;
    @Autowired
    SourceRepository sourceRepository;
    @Autowired
    UserRepository userRepository;

    @Test
    void laContrainteUniqueEmpecheUnInsertEnDoublon() {
        User user = userRepository.save(new User("t@t.fr", "t", "hash"));
        Source source = sourceRepository.save(new Source(user, "https://x.fr/rss", "X"));
        articleRepository.save(new Article(source, "T1", "https://x.fr/a1", "", Instant.now()));

        assertThrows(DataIntegrityViolationException.class, () ->
                articleRepository.saveAndFlush(
                        new Article(source, "T1 bis", "https://x.fr/a1", "", Instant.now())));
    }
}
