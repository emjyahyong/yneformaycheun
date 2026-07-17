package com.api.yneformaycheun.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.junit.jupiter.api.Test;

/** Tests unitaires du cycle de vie du jeton JWT. */
class JwtServiceTest {

    private static final String SECRET = "test-secret-yneformaycheun-0123456789-abcdef";
    private final JwtService jwtService = new JwtService(SECRET);

    @Test
    void unJetonGenereEstValideEtPorteLUtilisateur() {
        String token = jwtService.genererToken("user@test.fr");
        assertTrue(jwtService.estValide(token));
        assertEquals("user@test.fr", jwtService.extraireUtilisateur(token));
    }

    @Test
    void unJetonAltereEstRejete() {
        String token = jwtService.genererToken("user@test.fr");
        String altere = token.substring(0, token.length() - 2) + "xx";
        assertFalse(jwtService.estValide(altere));
    }

    @Test
    void unJetonExpireEstRejete() {
        SecretKey cle = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        String expire = Jwts.builder()
                .subject("user@test.fr")
                .issuedAt(Date.from(Instant.now().minusSeconds(7200)))
                .expiration(Date.from(Instant.now().minusSeconds(3600)))
                .signWith(cle)
                .compact();
        assertFalse(jwtService.estValide(expire));
    }

    @Test
    void unJetonSigneParUneAutreCleEstRejete() {
        SecretKey autreCle = Keys.hmacShaKeyFor(
                "une-tout-autre-cle-secrete-de-32-octets-min".getBytes(StandardCharsets.UTF_8));
        String etranger = Jwts.builder()
                .subject("intrus@test.fr")
                .expiration(Date.from(Instant.now().plusSeconds(3600)))
                .signWith(autreCle)
                .compact();
        assertFalse(jwtService.estValide(etranger));
    }
}
