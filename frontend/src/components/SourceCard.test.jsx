import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SourceCard from './SourceCard'

/**
 * Tests unitaires de la carte d'une source RSS : traduction du statut de
 * fetch renvoyé par l'API en libellé lisible, et déclenchement des actions
 * de rafraîchissement manuel et de suppression.
 */

const source = {
  id: 7,
  titre: 'Blog Baeldung',
  urlRss: 'https://www.baeldung.com/feed',
  statutFetch: 'succes',
  dateDernierFetch: '2026-03-14T10:00:00Z',
}

const afficher = (props = {}) =>
  render(
    <SourceCard
      source={source}
      onDelete={vi.fn()}
      onRefresh={vi.fn()}
      {...props}
    />,
  )

describe('SourceCard — statut du dernier fetch', () => {
  it('affiche « Actif » quand le dernier fetch a réussi', () => {
    afficher()
    expect(screen.getByText('Actif')).toBeInTheDocument()
  })

  it('affiche « Erreur » quand le dernier fetch a échoué', () => {
    afficher({ source: { ...source, statutFetch: 'echec' } })
    expect(screen.getByText('Erreur')).toBeInTheDocument()
  })

  it('affiche « En attente » tant qu\'aucun fetch n\'a eu lieu', () => {
    afficher({ source: { ...source, statutFetch: null } })
    expect(screen.getByText('En attente')).toBeInTheDocument()
  })

  it('indique « jamais récupéré » en l\'absence de date de fetch', () => {
    afficher({ source: { ...source, dateDernierFetch: null } })
    expect(screen.getByText('jamais récupéré')).toBeInTheDocument()
  })

  it('affiche le titre et l\'URL du flux', () => {
    afficher()
    expect(screen.getByText('Blog Baeldung')).toBeInTheDocument()
    expect(screen.getByText('https://www.baeldung.com/feed')).toBeInTheDocument()
  })

  it('affiche « Sans titre » quand la source n\'en a pas', () => {
    afficher({ source: { ...source, titre: '' } })
    expect(screen.getByText('Sans titre')).toBeInTheDocument()
  })
})

describe('SourceCard — actions', () => {
  it('déclenche le rafraîchissement manuel avec la source', async () => {
    const onRefresh = vi.fn()
    afficher({ onRefresh })

    await userEvent.click(screen.getByRole('button', { name: /rafraîchir/i }))

    expect(onRefresh).toHaveBeenCalledWith(source)
  })

  it('déclenche la suppression avec la source', async () => {
    const onDelete = vi.fn()
    afficher({ onDelete })

    await userEvent.click(screen.getByRole('button', { name: /supprimer/i }))

    expect(onDelete).toHaveBeenCalledWith(source)
  })

  it('désactive le bouton et affiche la progression pendant la récupération', () => {
    afficher({ rafraichissement: true })

    const bouton = screen.getByRole('button', { name: /récupération/i })
    expect(bouton).toBeDisabled()
  })

  it('désactive le bouton de suppression pendant l\'opération', () => {
    afficher({ suppression: true })

    expect(screen.getByRole('button', { name: /supprimer/i })).toBeDisabled()
  })
})
