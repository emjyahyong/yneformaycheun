import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Login from './Login'
import { AuthProvider } from '../auth/AuthContext'
import { api, setToken } from '../api/client'

/**
 * Tests d'intégration de la page de connexion : soumission du formulaire,
 * redirection après authentification et traduction des erreurs serveur en
 * messages compréhensibles par l'utilisateur.
 */

vi.mock('../api/client', () => ({
  api: { login: vi.fn(), register: vi.fn() },
  getToken: vi.fn(() => null),
  setToken: vi.fn(),
  clearToken: vi.fn(),
  setUnauthorizedHandler: vi.fn(),
}))

const afficher = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<h1>Fil d&apos;actualité</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )

const remplirEtSoumettre = async () => {
  await userEvent.type(screen.getByLabelText(/e-mail/i), 'veilleur@test.fr')
  await userEvent.type(screen.getByLabelText(/mot de passe/i), 'motdepasse')
  await userEvent.click(screen.getByRole('button', { name: /se connecter/i }))
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche le formulaire de connexion', () => {
    afficher()

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
  })

  it('transmet les identifiants saisis à l\'API', async () => {
    api.login.mockResolvedValue({ token: 'jeton-valide' })
    afficher()

    await remplirEtSoumettre()

    await waitFor(() =>
      expect(api.login).toHaveBeenCalledWith({
        email: 'veilleur@test.fr',
        password: 'motdepasse',
      }),
    )
  })

  it('enregistre le jeton et redirige vers le fil après connexion', async () => {
    api.login.mockResolvedValue({ token: 'jeton-valide' })
    afficher()

    await remplirEtSoumettre()

    await waitFor(() => expect(setToken).toHaveBeenCalledWith('jeton-valide'))
    expect(await screen.findByRole('heading', { name: /fil d'actualité/i })).toBeInTheDocument()
  })

  it('affiche un message explicite quand les identifiants sont refusés', async () => {
    const erreur = new Error('Session expirée ou non authentifiée')
    erreur.status = 401
    api.login.mockRejectedValue(erreur)
    afficher()

    await remplirEtSoumettre()

    expect(await screen.findByText('E-mail ou mot de passe incorrect.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /fil d'actualité/i })).not.toBeInTheDocument()
  })

  it('remonte le message du serveur pour les autres erreurs', async () => {
    const erreur = new Error('Service indisponible')
    erreur.status = 500
    api.login.mockRejectedValue(erreur)
    afficher()

    await remplirEtSoumettre()

    expect(await screen.findByText('Service indisponible')).toBeInTheDocument()
  })

  it('désactive le bouton pendant la soumission', async () => {
    let resoudre
    api.login.mockReturnValue(new Promise((r) => { resoudre = r }))
    afficher()

    await remplirEtSoumettre()

    expect(screen.getByRole('button', { name: /se connecter/i })).toBeDisabled()

    // On laisse la connexion aboutir pour que React traite la mise à jour
    // d'état à l'intérieur du test.
    resoudre({ token: 'jeton-valide' })
    await waitFor(() => expect(setToken).toHaveBeenCalledWith('jeton-valide'))
  })
})
