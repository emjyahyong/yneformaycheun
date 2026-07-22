import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, api, clearToken, getToken, setToken, setUnauthorizedHandler } from './client'

/**
 * Tests unitaires du client API : injection du jeton JWT, traitement
 * centralisé du 401 et remontée des erreurs métier. `fetch` est simulé :
 * aucun appel réseau réel n'est effectué.
 */

/** Fabrique une réponse fetch simulée. */
function reponse({ status = 200, body = null }) {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => (body === null ? '' : JSON.stringify(body)),
  }
}

/** Remplace fetch par un mock et le renvoie pour inspection. */
function simulerFetch(rep) {
  const mock = vi.fn().mockResolvedValue(rep)
  vi.stubGlobal('fetch', mock)
  return mock
}

describe('client API', () => {
  beforeEach(() => {
    localStorage.clear()
    setUnauthorizedHandler(null)
  })

  it('injecte le jeton dans l\'en-tête Authorization quand il est présent', async () => {
    setToken('jeton-abc')
    const fetchMock = simulerFetch(reponse({ body: [] }))

    await api.getSources()

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer jeton-abc')
  })

  it('n\'envoie pas d\'en-tête Authorization sur les routes publiques', async () => {
    setToken('jeton-abc')
    const fetchMock = simulerFetch(reponse({ body: { token: 'x' } }))

    await api.login({ email: 'a@b.fr', password: 'secret' })

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers.Authorization).toBeUndefined()
  })

  it('sur 401 : vide le jeton, déclenche le handler et lève une ApiError 401', async () => {
    setToken('jeton-expire')
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    simulerFetch(reponse({ status: 401 }))

    await expect(api.getArticles()).rejects.toBeInstanceOf(ApiError)

    expect(getToken()).toBeNull()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('renvoie null sur une réponse 204 sans contenu', async () => {
    setToken('jeton-abc')
    simulerFetch(reponse({ status: 204 }))

    await expect(api.deleteSource(1)).resolves.toBeNull()
  })

  it('remonte le code et le message d\'erreur renvoyés par l\'API', async () => {
    setToken('jeton-abc')
    simulerFetch(
      reponse({ status: 400, body: { code: 'URL_INVALIDE', message: 'URL de flux invalide' } }),
    )

    await expect(api.addSource({ urlRss: 'mauvaise' })).rejects.toMatchObject({
      status: 400,
      code: 'URL_INVALIDE',
      message: 'URL de flux invalide',
    })
  })

  it('renvoie les données désérialisées sur une réponse valide', async () => {
    setToken('jeton-abc')
    const attendu = { content: [{ id: 1, titre: 'Article A' }], totalElements: 1 }
    simulerFetch(reponse({ body: attendu }))

    await expect(api.getArticles()).resolves.toEqual(attendu)
  })

  it('construit les paramètres de filtrage du fil d\'articles', async () => {
    setToken('jeton-abc')
    const fetchMock = simulerFetch(reponse({ body: {} }))

    await api.getArticles({ tag: 3, page: 2, size: 12 })

    const [url] = fetchMock.mock.calls[0]
    expect(url).toContain('tag=3')
    expect(url).toContain('page=2')
    expect(url).toContain('size=12')
    expect(url).not.toContain('source=')
  })

  it('cible la route de marquage « à lire plus tard » en POST', async () => {
    setToken('jeton-abc')
    const fetchMock = simulerFetch(reponse({ status: 204 }))

    await api.marquerALire(42)

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/articles/42/a-lire')
    expect(options.method).toBe('POST')
  })

  it('supprime le jeton du stockage local à la déconnexion', () => {
    setToken('jeton-abc')
    expect(getToken()).toBe('jeton-abc')

    clearToken()

    expect(getToken()).toBeNull()
  })
})
