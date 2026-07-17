# Yneformaycheun — Frontend

Application **React + Vite** séparée, consommant l'API REST du backend Spring Boot
via `fetch` et un jeton JWT porté dans l'en-tête `Authorization`.

## Stack
- React 18 + React Router 6
- Vite (dev server + build de production)
- Tailwind CSS (charte reprise des maquettes : palette `accent`, polices Barlow)
- ESLint

## Prérequis
- Node.js 18+ et npm
- Le backend Yneformaycheun démarré (par défaut sur `http://localhost:8080`)

## Démarrage en développement
```bash
npm install
npm run dev
```
L'application est servie sur http://localhost:5173.

Les appels `/api/...` sont relayés vers le backend par le **proxy Vite** (voir
`vite.config.js`) : aucune configuration CORS n'est nécessaire en dev. Pour cibler
un autre backend : `VITE_API_TARGET=http://autre-hote:8080 npm run dev`.

## Build de production
```bash
npm run build      # génère dist/
npm run preview    # prévisualise le build
```
En production, définissez `VITE_API_URL` (fichier `.env`) sur l'URL publique de
l'API ; les fichiers statiques de `dist/` sont ensuite servis par nginx.

## Structure
```
src/
  api/client.js         Appels fetch + injection JWT + gestion 401
  auth/AuthContext.jsx  État d'authentification (jeton, login/register/logout)
  components/           Navbar, cartes, formulaires, états, icônes
  pages/                Login, Register, Dashboard, Sources, ArticleDetail
  utils/format.js       Formatage des dates
```

## Pages
| Route | Écran | Accès |
|-------|-------|-------|
| `/login` | Connexion | public |
| `/register` | Inscription | public |
| `/` | Dashboard (fil d'articles + filtres tag/source) | protégé |
| `/sources` | Gestion des sources RSS (liste, ajout, suppression) | protégé |
| `/article/:id` | Détail d'un article (contenu, tags, notes) | protégé |

Les routes protégées redirigent vers `/login` en l'absence de jeton JWT valide.
