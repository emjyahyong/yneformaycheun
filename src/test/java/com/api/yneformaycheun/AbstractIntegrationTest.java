package com.api.yneformaycheun;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Base des tests d'intégration : une base PostgreSQL éphémère fournie par
 * TestContainers, isolée de la base de développement et réinitialisée à chaque
 * exécution (jeu d'essai restaurable). {@code @ServiceConnection} branche
 * automatiquement la datasource Spring sur le conteneur.
 */
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:15-alpine");
}
