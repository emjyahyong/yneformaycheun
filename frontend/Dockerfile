# --- Build stage : compilation du frontend React ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# VITE_API_URL vide => l'app appelle /api en relatif, proxifié par nginx.
RUN npm run build

# --- Serve stage : nginx sert les fichiers statiques + reverse proxy /api ---
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
