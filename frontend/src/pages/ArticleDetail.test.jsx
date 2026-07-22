import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ArticleDetail from './ArticleDetail'
import { api } from '../api/client'

/**
 * Tests d'intégration de la page de détail : chargement parallèle
 * (article, notes, tags, statut « à lire »), marquage réversible,
 * association d'un tag et ajout d'une note avec validation.
 */

vi.mock('../api/client', () => ({
  api: {
    getArticle: vi.fn(),
    getNotes: vi.fn(),
    getTags: vi.fn(),
    getALireStatut: vi.fn(),
    marquerALire: vi.fn(),
    demarquerALire: vi.fn(),
    addTagToArticle: vi.fn(),
    removeTagFromArticle: vi.fn(),
    createTag: vi.fn(),
    addNote: vi.fn(),
  },
}))

const ARTICLE = {
  id: 42,
  titre: 'Records en Java 21',
  sourceNom: 'Blog Baeldung',
  url: 'https://x.fr/a1',
  resume: '<p>Un tour des records.</p>',
  datePublication: '2026-03-14T10:00:00Z',
  tags: [{ id: 1, nom: 'Java', couleur: '#5980a6' }],
}

const TOUS_LES_TAGS = [
  { id: 1, nom: 'Java', couleur: '#5980a6' },
  { id: 2, nom: 'Backend', couleur: null },
]

const afficher = () =>
  render(
    <MemoryRouter initialEntries={['/article/42']}>
      <Routes>
        <Route path="/article/:id" element={<ArticleDetail />} />
      </Routes>
    </MemoryRouter>,
  )

describe('ArticleDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getArticle.mockResolvedValue(ARTICLE)
    api.getNotes.mockResolvedValue([])
    api.getTags.mockResolvedValue(TOUS_LES_TAGS)
    api.getALireStatut.mockResolvedValue({ marque: false })
  })

  it('affiche le contenu de l\'article après chargement', async () => {
    afficher()

    expect(screen.getByText(/chargement de l'article/i)).toBeInTheDocument()

    expect(await screen.findByRole('heading', { name: 'Records en Java 21' })).toBeInTheDocument()
    expect(screen.getByText('Blog Baeldung')).toBeInTheDocument()
    expect(screen.getByText('Un tour des records.')).toBeInTheDocument()
  })

  it('affiche les tags déjà associés à l\'article', async () => {
    afficher()

    expect(await screen.findByText('Java')).toBeInTheDocument()
  })

  it('marque l\'article « à lire plus tard »', async () => {
    api.marquerALire.mockResolvedValue(null)
    afficher()
    const bouton = await screen.findByRole('button', { name: /^à lire plus tard$/i })

    await userEvent.click(bouton)

    await waitFor(() => expect(api.marquerALire).toHaveBeenCalledWith('42'))
    expect(await screen.findByRole('button', { name: /marqué à lire plus tard/i })).toBeInTheDocument()
  })

  it('retire la marque quand l\'article est déjà marqué', async () => {
    api.getALireStatut.mockResolvedValue({ marque: true })
    api.demarquerALire.mockResolvedValue(null)
    afficher()
    const bouton = await screen.findByRole('button', { name: /marqué à lire plus tard/i })

    await userEvent.click(bouton)

    await waitFor(() => expect(api.demarquerALire).toHaveBeenCalledWith('42'))
  })

  it('retire un tag de l\'article', async () => {
    api.removeTagFromArticle.mockResolvedValue({ ...ARTICLE, tags: [] })
    afficher()
    await screen.findByText('Java')

    await userEvent.click(screen.getByRole('button', { name: /retirer le tag java/i }))

    await waitFor(() => expect(api.removeTagFromArticle).toHaveBeenCalledWith('42', 1))
  })

  it('associe un tag existant choisi dans la liste', async () => {
    api.addTagToArticle.mockResolvedValue({
      ...ARTICLE,
      tags: [...ARTICLE.tags, { id: 2, nom: 'Backend', couleur: null }],
    })
    afficher()
    await screen.findByText('Java')

    await userEvent.selectOptions(screen.getByRole('combobox'), '2')
    await userEvent.click(screen.getByRole('button', { name: /^ajouter$/i }))

    await waitFor(() => expect(api.addTagToArticle).toHaveBeenCalledWith('42', '2'))
    expect(await screen.findByText('Backend')).toBeInTheDocument()
  })

  it('refuse une note vide sans appeler l\'API', async () => {
    afficher()
    await screen.findByRole('heading', { name: 'Records en Java 21' })

    await userEvent.click(screen.getByRole('button', { name: /enregistrer la note/i }))

    expect(await screen.findByText(/ne peut pas être vide/i)).toBeInTheDocument()
    expect(api.addNote).not.toHaveBeenCalled()
  })

  it('ajoute une note et l\'affiche immédiatement', async () => {
    api.addNote.mockResolvedValue({
      id: 5,
      contenu: 'À relire pour le projet',
      timestamp: '2026-03-14T12:00:00Z',
    })
    afficher()
    await screen.findByRole('heading', { name: 'Records en Java 21' })

    await userEvent.type(
      screen.getByPlaceholderText(/écrire une note/i),
      'À relire pour le projet',
    )
    await userEvent.click(screen.getByRole('button', { name: /enregistrer la note/i }))

    await waitFor(() =>
      expect(api.addNote).toHaveBeenCalledWith('42', 'À relire pour le projet'),
    )
    expect(await screen.findByText('À relire pour le projet')).toBeInTheDocument()
  })

  it('affiche l\'erreur quand l\'article est inaccessible', async () => {
    api.getArticle.mockRejectedValue(new Error('Ressource inaccessible'))
    afficher()

    expect(await screen.findByText('Ressource inaccessible')).toBeInTheDocument()
  })
})
