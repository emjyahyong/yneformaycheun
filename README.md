# Yneformaycheun

Application de veille technologique (RSS) : centraliser des flux, tagger et annoter les articles pour un usage personnel — projet réalisé dans le cadre du dossier professionnel CDA (VeilleHub).

## Fonctionnalités prévues

- Gestion de sources RSS (ajout, suivi du statut, dernière synchronisation)
- Fil d'actualité agrégé, filtrable par tag et par source
- Détail d'article avec tags et notes personnelles
- Extension navigateur pour ajouter un article depuis sa page

## Stack technique

- Java 21 / Spring Boot 3.5.16
- Spring Web, Spring Data JPA, Spring Security, Spring Validation
- PostgreSQL
- Liquibase (migrations)
- Spring AI (JSoup Document Reader, pour le parsing de contenu)
- Maven

## Prérequis

- JDK 21
- PostgreSQL en local (ou accessible), avec une base créée
- Maven (ou utiliser le wrapper `mvnw` fourni)

## Configuration

La configuration se trouve dans `src/main/resources/application.properties`. Les identifiants de base de données sont surchargeables par variables d'environnement (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`), avec les valeurs actuelles comme défaut en local sans Docker :

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/TiTravay}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:UserTest}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:aaa}
```

## Lancer le projet

### Sans Docker

```bash
./mvnw spring-boot:run
```

L'application démarre sur [http://localhost:8080](http://localhost:8080).

> Spring Security est présent dans les dépendances : tant qu'aucune `SecurityFilterChain` personnalisée n'est configurée, toutes les routes sont protégées par défaut et redirigent vers `/login`.

### Avec Docker (environnement de dev)

Prérequis : Docker et Docker Compose.

1. Copier le fichier d'exemple et renseigner des valeurs (le `.env` n'est jamais commité) :

   ```bash
   cp .env.example .env
   ```

2. Démarrer l'environnement :

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

Cela lance deux services :

| Service    | Rôle                          | Port exposé (hôte)      |
|------------|-------------------------------|--------------------------|
| `app`      | Application Spring Boot        | `APP_PORT` (8080 par défaut) |
| `postgres` | PostgreSQL 15                  | `POSTGRES_PORT` (5432 par défaut) |

Le service `app` attend que `postgres` soit prêt (healthcheck `pg_isready`) avant de démarrer. Les données PostgreSQL sont conservées entre les redémarrages grâce au volume nommé `veillehub_pgdata`.

Pour arrêter :

```bash
docker compose -f docker-compose.dev.yml down
```

## Structure du projet

```
src/main/java/com/api/yneformaycheun/   Code source de l'application
src/main/resources/
  application.properties                Configuration
  templates/                             Vues HTML (accueil, dashboard, détail article)
  db/                                    Migrations Liquibase
src/test/                               Tests
```

## Statut

Projet en cours de développement — les vues front-end existent, mais les controllers, la persistance et la configuration de sécurité restent à implémenter.
