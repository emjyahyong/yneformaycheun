package com.api.yneformaycheun.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.api.yneformaycheun.AbstractIntegrationTest;
import com.api.yneformaycheun.model.Article;
import com.api.yneformaycheun.model.Source;
import com.api.yneformaycheun.model.Tag;
import com.api.yneformaycheun.model.User;
import com.api.yneformaycheun.repository.ArticleRepository;
import com.api.yneformaycheun.repository.SourceRepository;
import com.api.yneformaycheun.repository.TagRepository;
import com.api.yneformaycheun.repository.UserRepository;
import com.api.yneformaycheun.service.JwtService;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Test de non-régression : le fil d'articles doit se sérialiser sans
 * LazyInitializationException, y compris pour un article portant des tags
 * (relation LAZY mappée dans la transaction du service, open-in-view=false).
 */
@AutoConfigureMockMvc
class ArticleControllerIT extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    UserRepository userRepository;
    @Autowired
    SourceRepository sourceRepository;
    @Autowired
    ArticleRepository articleRepository;
    @Autowired
    TagRepository tagRepository;
    @Autowired
    JwtService jwtService;

    @Test
    void leFilRenvoieLesArticlesAvecLeursTagsSansErreurDeSession() throws Exception {
        User user = userRepository.save(new User("lazy@test.fr", "lazy", "hash"));
        Source source = sourceRepository.save(new Source(user, "https://x.fr/rss", "Source X"));
        Tag tag = tagRepository.save(new Tag(user, "Java", "#5980a6"));
        Article article = new Article(source, "Titre A", "https://x.fr/a1", "résumé", Instant.now());
        article.getTags().add(tag);
        articleRepository.save(article);

        String token = jwtService.genererToken(user.getEmail());

        mockMvc.perform(get("/api/articles").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].titre").value("Titre A"))
                .andExpect(jsonPath("$.content[0].sourceNom").value("Source X"))
                .andExpect(jsonPath("$.content[0].tags[0]").value("Java"));
    }
}
