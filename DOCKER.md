# Setup Docker - Environnement de développement

Ce guide explique comment démarrer et configurer l'environnement de développement avec Docker.

## Prérequis

- Docker Desktop (v28.3.2+) ou Docker + Docker Compose (v2.39.1+)
- Git

## Configuration initiale

### 1. Créer le fichier `.env`

Copier le fichier d'exemple et adapter les valeurs :

```bash
cp .env.example .env
```

Contenu du `.env` (adapter selon besoin) :

```
POSTGRES_DB=yneformaycheun
POSTGRES_USER=yneformaycheun
POSTGRES_PASSWORD=changeme
# Port hôte de PostgreSQL — 5433 si un PostgreSQL est déjà installé sur la machine (occupe 5432).
POSTGRES_PORT=5433
APP_PORT=8080
# Port hôte du frontend (nginx).
FRONTEND_PORT=80

# Secret de signature JWT — au moins 32 octets (256 bits) pour HS256.
JWT_SECRET=change-me-please-with-a-32-bytes-min-secret
# Origine(s) autorisée(s) pour le CORS (inutile en mono-stack : le frontend passe par nginx, même origine).
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

⚠️ **Important** : Le fichier `.env` contient des identifiants de base de données. **Ne jamais le commiter** — il est exclu du `.gitignore`.

## Démarrer l'environnement

### Lancer les services (frontend + app + PostgreSQL)

```bash
docker compose up -d --build
```

Cela va :
- Builder l'image de l'app (Maven compile le code, crée le JAR)
- Builder l'image du frontend (npm compile le build React, servi par nginx)
- Démarrer PostgreSQL 15
- Attendre que PostgreSQL soit prêt (`pg_isready`)
- Démarrer l'app Spring Boot, puis nginx (reverse proxy `/api` → `app:8080`)

### Vérifier que tout fonctionne

```bash
# Voir les logs de l'app
docker logs -f yneformaycheun-app-dev

# Voir les logs de PostgreSQL
docker logs yneformaycheun-postgres-dev

# Vérifier le statut des services
docker ps
```

Indicateurs de succès dans les logs :
- `HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection` → connexion BDD OK
- `Tomcat started on port 8080 (http)` → app démarrée
- Pas de `ERROR` ou `FATAL`

## Accéder à l'application

Tout passe par nginx (port `FRONTEND_PORT`, 80 par défaut) : l'application React
et, via reverse proxy, l'API.

| Ressource | URL |
|-----------|-----|
| Application (frontend React) | http://localhost/ |
| Connexion / Inscription | http://localhost/login · http://localhost/register |
| API REST (proxifiée) | http://localhost/api/... |
| Swagger UI | http://localhost/swagger-ui/index.html |
| Actuator (health) | http://localhost/actuator/health |
| API en accès direct (sans nginx) | http://localhost:8080/ |

## Arrêter l'environnement

```bash
docker compose down
```

Cela arrête et supprime les conteneurs, mais **préserve les données PostgreSQL** (volume nommé `yneformaycheun_pgdata`).

Pour supprimer aussi les données :

```bash
docker compose down -v
```

## Workflow de développement

### Fichiers statiques (HTML, CSS, JS dans `src/main/resources/static/`)

Aucun rebuild nécessaire : Spring Boot les recharge automatiquement.

1. Éditer `src/main/resources/static/accueil.html` (ou autre)
2. Rafraîchir le navigateur (F5)
3. Changements visibles immédiatement

### Code Java (controllers, config, services)

Rebuild et redémarrage du conteneur nécessaires :

```bash
docker compose up -d --build app
```

Temps approximatif : 30-60s (Maven compile, repackage, redémarrage).

### Problèmes courants

**Le conteneur app ne démarre pas**

Vérifier les logs :
```bash
docker logs yneformaycheun-app-dev
```

Causes courantes :
- PostgreSQL pas encore prêt : attendre 10-20s, voir la healthcheck
- Port 8080 déjà utilisé : vérifier les autres conteneurs actifs (`docker ps`)
- `.env` manquant ou mal formaté : relancer après correction

**PostgreSQL: `ERROR: password authentication failed`**

Vérifier que `POSTGRES_PASSWORD` dans `.env` correspond à celui défini au premier démarrage.
Sinon, supprimer le volume et redémarrer :

```bash
docker compose down -v
docker compose up -d
```

**Connexion BDD impossible**

Vérifier que PostgreSQL est healthy :
```bash
docker ps  # vérifie que postgres est "Up" et "healthy"
docker exec yneformaycheun-postgres-dev pg_isready -U yneformaycheun -d yneformaycheun
```

## Architecture des services

### `yneformaycheun-frontend-dev`

- Image : buildée depuis `frontend/Dockerfile` (build React multi-étapes → nginx)
- Port : `FRONTEND_PORT` (80 par défaut)
- Rôle : sert le build statique React et fait office de reverse proxy `/api`,
  `/swagger-ui`, `/actuator` vers l'app (même origine → pas de CORS côté navigateur)
- Restart : `unless-stopped`
- Dépendance : `app`

### `yneformaycheun-app-dev`

- Image : `yneformaycheun-app:latest` (buildée depuis `Dockerfile`)
- Port : `APP_PORT` (8080 par défaut)
- Restart : `unless-stopped` (relance auto sauf si arrêt manuel)
- Dépendance : PostgreSQL (attend `service_healthy`)

### `yneformaycheun-postgres-dev`

- Image : `postgres:15`
- Port : `POSTGRES_PORT` (5432 par défaut)
- Volume : `yneformaycheun_pgdata` (persistance des données entre redémarrages)
- Healthcheck : `pg_isready` toutes les 5s (timeout 5s, max 10 tentatives)
- Restart : `unless-stopped`

## Volumes

**`yneformaycheun_pgdata`** : Stocke les données PostgreSQL. Persiste entre `docker compose up/down` sauf si `-v` est passé à `down`.

## Variables d'environnement

L'app utilise les variables du fichier `.env` pour configurer la connexion BDD :

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/${POSTGRES_DB}
SPRING_DATASOURCE_USERNAME=${POSTGRES_USER}
SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}
```

Les valeurs sont définies dans `docker-compose.yml` et lues depuis `.env`.

## Accès direct à PostgreSQL

Pour inspecter la BDD avec `psql` ou un client :

```bash
docker exec -it yneformaycheun-postgres-dev psql -U yneformaycheun -d yneformaycheun
```

Ou via un client GUI (DBeaver, pgAdmin...) :
- Host : `localhost`
- Port : `5432` (ou `POSTGRES_PORT` si personnalisé)
- User : `yneformaycheun` (ou `POSTGRES_USER`)
- Password : `changeme` (ou `POSTGRES_PASSWORD`)
- Database : `yneformaycheun` (ou `POSTGRES_DB`)

## Ressources supplémentaires

- [Docker Compose reference](https://docs.docker.com/compose/compose-file/)
- [Spring Boot Docker guide](https://spring.io/guides/gs/spring-boot-docker/)
- [PostgreSQL Docker image](https://hub.docker.com/_/postgres)
