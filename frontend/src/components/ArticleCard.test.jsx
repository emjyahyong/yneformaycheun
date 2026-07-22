import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ArticleCard from './ArticleCard'

/**
 * Tests unitaires de la carte d'article du fil : rendu des données issues de
 * l'ArticleDto (titre, source, tags) et action « retirer de la liste à lire ».
 */

const article = {
  id: 42,
  titre: 'Les nouveautés de Java 21',
  sourceNom: 'Blog Baeldung',
  resume: 'Un tour des records et du pattern matching.',
  datePublication: '2026-03-14T10:00:00Z',
  tags: [
    { id: 1, nom: 'Java', couleur: '#5980a6' },
    { id: 2, nom: 'Backend', couleur: null },
  ],
}

const afficher = (props = {}) =>
  render(
    <MemoryRouter>
      <ArticleCard article={article} {...props} />
    </MemoryRouter>,
  )

describe('ArticleCard', () => {
  it('affiche le titre, la source et le résumé de l\'article', () => {
    afficher()

    expect(screen.getByText('Les nouveautés de Java 21')).toBeInTheDocument()
    expect(screen.getByText('Blog Baeldung')).toBeInTheDocument()
    expect(screen.getByText(/pattern matching/)).toBeInTheDocument()
  })

  it('affiche chaque tag associé à l\'article', () => {
    afficher()

    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByText('Backend')).toBeInTheDocument()
  })

  it('pointe vers la page de détail de l\'article', () => {
    afficher()

    expect(screen.getByRole('link', { name: /lire l'article/i })).toHaveAttribute(
      'href',
      '/article/42',
    )
  })

  it('n\'affiche pas le bouton de retrait hors de la liste « à lire plus tard »', () => {
    afficher()

    expect(screen.queryByRole('button', { name: /retirer/i })).not.toBeInTheDocument()
  })

  it('déclenche le retrait avec l\'article concerné', async () => {
    const onRetirerALire = vi.fn()
    afficher({ onRetirerALire })

    await userEvent.click(screen.getByRole('button', { name: /retirer/i }))

    expect(onRetirerALire).toHaveBeenCalledWith(article)
  })

  it('désactive le bouton pendant que le retrait est en cours', () => {
    afficher({ onRetirerALire: vi.fn(), retraitEnCours: true })

    expect(screen.getByRole('button', { name: /retirer/i })).toBeDisabled()
  })

  it('n\'affiche pas de bloc résumé quand l\'article n\'en a pas', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={{ ...article, resume: null }} />
      </MemoryRouter>,
    )

    expect(screen.queryByText(/pattern matching/)).not.toBeInTheDocument()
  })
})
