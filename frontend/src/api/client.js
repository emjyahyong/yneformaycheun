// Client API : encapsule fetch, injecte le jeton JWT dans l'en-tête
// Authorization et centralise la gestion des erreurs (dont le 401).
const BASE = import.meta.env.VITE_API_URL || ''
const TOKEN_KEY = 'yne_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Handler global déclenché sur 401 (défini par le contexte d'auth) : permet de
// rediriger vers la connexion sans dupliquer la logique dans chaque composant.
let onUnauthorized = null
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    clearToken()
    if (onUnauthorized) onUnauthorized()
    throw new ApiError(401, 'UNAUTHORIZED', 'Session expirée ou non authentifiée')
  }
  if (res.status === 204) return null

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const code = data?.code || 'ERREUR'
    const message = data?.message || `Erreur ${res.status}`
    throw new ApiError(res.status, code, message)
  }
  return data
}

export const api = {
  register: (body) => request('/api/auth/register', { method: 'POST', body, auth: false }),
  login: (body) => request('/api/auth/login', { method: 'POST', body, auth: false }),

  getSources: () => request('/api/sources'),
  addSource: (body) => request('/api/sources', { method: 'POST', body }),
  refreshSource: (id) => request(`/api/sources/${id}/fetch`, { method: 'POST' }),
  deleteSource: (id) => request(`/api/sources/${id}`, { method: 'DELETE' }),

  getArticles: ({ tag, source, page = 0, size = 12 } = {}) => {
    const params = new URLSearchParams()
    if (tag) params.set('tag', tag)
    if (source) params.set('source', source)
    params.set('page', page)
    params.set('size', size)
    return request(`/api/articles?${params.toString()}`)
  },
  getArticle: (id) => request(`/api/articles/${id}`),

  getArticlesALire: ({ page = 0, size = 12 } = {}) => {
    const params = new URLSearchParams()
    params.set('page', page)
    params.set('size', size)
    return request(`/api/articles/a-lire?${params.toString()}`)
  },
  getALireStatut: (articleId) => request(`/api/articles/${articleId}/a-lire`),
  marquerALire: (articleId) => request(`/api/articles/${articleId}/a-lire`, { method: 'POST' }),
  demarquerALire: (articleId) => request(`/api/articles/${articleId}/a-lire`, { method: 'DELETE' }),

  getNotes: (articleId) => request(`/api/articles/${articleId}/notes`),
  addNote: (articleId, contenu) =>
    request(`/api/articles/${articleId}/notes`, { method: 'POST', body: { contenu } }),

  getTags: () => request('/api/tags'),
  createTag: (body) => request('/api/tags', { method: 'POST', body }),
  updateTag: (id, body) => request(`/api/tags/${id}`, { method: 'PUT', body }),
  deleteTag: (id) => request(`/api/tags/${id}`, { method: 'DELETE' }),
  addTagToArticle: (articleId, tagId) =>
    request(`/api/articles/${articleId}/tags/${tagId}`, { method: 'POST' }),
  removeTagFromArticle: (articleId, tagId) =>
    request(`/api/articles/${articleId}/tags/${tagId}`, { method: 'DELETE' }),
}
