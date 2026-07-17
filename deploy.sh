#!/usr/bin/env bash
# Déploiement local simulant la production (Docker Compose).
set -e

./mvnw clean package -DskipTests
docker build -t yneformaycheun:latest .
docker compose down
docker compose up -d --build

echo "Attente du démarrage..."
until curl -sf http://localhost:8080/actuator/health >/dev/null; do sleep 2; done
echo "Déploiement OK"
