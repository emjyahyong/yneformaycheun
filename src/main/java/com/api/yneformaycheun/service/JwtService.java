package com.api.yneformaycheun.service;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Génération et validation des jetons JWT (authentification stateless).
 * Le secret de signature est injecté hors du dépôt (variable d'environnement).
 */
@Service
public class JwtService {

    private final SecretKey cle;
    private static final long DUREE_VALIDITE_MS = 3_600_000; // 1 heure

    public JwtService(@Value("${app.jwt.secret}") String secret) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret est absent ou trop court : il doit faire au moins 32 octets "
                    + "(256 bits) pour HS256. Vérifiez la variable d'environnement APP_JWT_SECRET "
                    + "(ou JWT_SECRET dans le fichier .env pour Docker).");
        }
        this.cle = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String genererToken(String userEmail) {
        Instant maintenant = Instant.now();
        return Jwts.builder()
                .subject(userEmail)
                .issuedAt(Date.from(maintenant))
                .expiration(Date.from(maintenant.plusMillis(DUREE_VALIDITE_MS)))
                .signWith(cle)
                .compact();
    }

    public String extraireUtilisateur(String token) {
        return Jwts.parser().verifyWith(cle).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean estValide(String token) {
        try {
            Jwts.parser().verifyWith(cle).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
