package com.api.yneformaycheun.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.api.yneformaycheun.AbstractIntegrationTest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Test de sécurité : l'API rejette (401) toute requête sans jeton JWT valide
 * ou avec un jeton expiré. Le contrôle d'accès reste centralisé dans la
 * configuration Spring Security.
 */
@AutoConfigureMockMvc
class ArticleControllerSecurityTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Value("${app.jwt.secret}")
    String secret;

    @Test
    void uneRequeteSansJetonEstRejetee() throws Exception {
        mockMvc.perform(get("/api/articles"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void uneRequeteAvecJetonExpireEstRejetee() throws Exception {
        mockMvc.perform(get("/api/articles")
                        .header("Authorization", "Bearer " + jetonExpirePourTest()))
                .andExpect(status().isUnauthorized());
    }

    private String jetonExpirePourTest() {
        SecretKey cle = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .subject("user@test.fr")
                .issuedAt(Date.from(Instant.now().minusSeconds(7200)))
                .expiration(Date.from(Instant.now().minusSeconds(3600)))
                .signWith(cle)
                .compact();
    }
}
