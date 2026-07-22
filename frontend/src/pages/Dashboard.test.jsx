import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'
import { api } from '../api/client'

/**
 * Tests d'intégration de la page du fil d'articles : enchaînement des appels
 * API au montage, filtrage par tag, bascule « à lire plus tard », recherche
 * côté client et états limites (vide, erreur). Le module client est simulé :
 * la page est testée sans backend.
 */

vi.mock('../api/client', () => ({
  api: {
    getTags: vi.fn(),
    getSources: vi.fn(),
    getArticles: vi.fn(),
    getArticlesALire: vi.fn(),
    deleteTag: vi.fn(),
  },
}))

const TAGS = [{ id: 1, nom: 'Java', couleur: '#5980a6' }]
const SOURCES = [{ id: 9, titre: 'Blog Baeldung', urlRss: 'https://x.fr/rss' }]

const pageDe = (articles) => ({
  content: articles,
  totalElements: articles.length,
  totalPages: 1,
  number: 0,
  first: true,
  last: true,
})

const ARTICLES = [
  {
    id: 1,
    titre: 'Records en Java 21',
    sourceNom: 'Blog Baeldung',
    resume: 'Un tour des records.',
    datePublication: '2026-03-14T10:00:00Z',
    tags: [],
  },
  {
    id: 2,
    titre: 'Pattern matching',
    sourceNom: 'Blog Baeldung',
    resume: 'Switch amélioré.',
    datePublication: '2026-03-13T10:00:00Z',
    tags: [],
  },
]

const afficher = () =>
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  )

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getTags.mockResolvedValue(TAGS)
    api.getSources.mockResolvedValue(SOURCES)
    api.getArticles.mockResolvedValue(pageDe(ARTICLES))
    api.getArticlesALire.mockResolvedValue(pageDe([]))
  })

  it('affiche un indicateur de chargement puis le fil', async () => {
    afficher()

    expect(screen.getByText(/chargement du fil/i)).toBeInTheDocument()

    expect(await screen.findByText('Records en Java 21')).toBeInTheDocument()
    expect(screen.getByText('Pattern matching')).toBeInTheDocument()
  })

  it('annonce le nombre total d\'articles', async () => {
    afficher()

    expect(await screen.findByText(/2 articles/)).toBeInTheDocument()
  })

  it('charge les filtres tags et sources au montage', async () => {
    afficher()

    expect(await screen.findByRole('button', { name: 'Java' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /blog baeldung/i })).toBeInTheDocument()
  })

  it('recharge le fil avec le tag sélectionné', async () => {
    afficher()
    await screen.findByText('Records en Java 21')

    await userEvent.click(screen.getByRole('button', { name: 'Java' }))

    await waitFor(() =>
      expect(api.getArticles).toHaveBeenLastCalledWith(
        expect.objectContaining({ tag: 1, page: 0 }),
      ),
    )
  })

  it('bascule sur la liste « à lire plus tard »', async () => {
    afficher()
    await screen.findByText('Records en Java 21')

    await userEvent.click(screen.getByRole('button', { name: /à lire plus tard/i }))

    await waitFor(() => expect(api.getArticlesALire).toHaveBeenCalled())
  })

  it('filtre les articles affichés via la recherche, sans nouvel appel API', async () => {
    afficher()
    await screen.findByText('Records en Java 21')
    const appelsAvant = api.getArticles.mock.calls.length

    await userEvent.type(screen.getByPlaceholderText(/rechercher/i), 'pattern')

    expect(screen.queryByText('Records en Java 21')).not.toBeInTheDocument()
    expect(screen.getByText('Pattern matching')).toBeInTheDocument()
    expect(api.getArticles.mock.calls.length).toBe(appelsAvant)
  })

  it('affiche un état vide quand aucun article ne remonte', async () => {
    api.getArticles.mockResolvedValue(pageDe([]))
    afficher()

    expect(await screen.findByText('Aucun article')).toBeInTheDocument()
  })

  it('affiche l\'erreur remontée par l\'API', async () => {
    api.getArticles.mockRejectedValue(new Error('Service indisponible'))
    afficher()

    expect(await screen.findByText('Service indisponible')).toBeInTheDocument()
  })
})
