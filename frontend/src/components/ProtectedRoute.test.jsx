import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import { setToken } from '../api/client'
import ProtectedRoute from './ProtectedRoute'

/**
 * Test de sécurité côté interface : la garde de route interdit l'accès aux
 * pages authentifiées sans jeton valide. C'est le pendant client du rejet 401
 * appliqué par Spring Security ; la sécurité reste garantie par le serveur,
 * cette garde évitant seulement d'afficher une coquille vide.
 */

/** Construit un JWT factice non signé (seul le payload est lu côté client). */
function jetonFactice({ sub = 'user@test.fr', expDansSecondes = 3600 } = {}) {
  const encode = (o) => btoa(JSON.stringify(o))
  const payload = { sub, exp: Math.floor(Date.now() / 1000) + expDansSecondes }
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.signature`
}

function afficherDashboard() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<h1>Page de connexion</h1>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <h1>Contenu protégé</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirige vers la connexion en l\'absence de jeton', () => {
    afficherDashboard()

    expect(screen.getByText('Page de connexion')).toBeInTheDocument()
    expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
  })

  it('rend la page demandée lorsque le jeton est valide', () => {
    setToken(jetonFactice())

    afficherDashboard()

    expect(screen.getByText('Contenu protégé')).toBeInTheDocument()
    expect(screen.queryByText('Page de connexion')).not.toBeInTheDocument()
  })

  it('redirige lorsque le jeton est expiré', () => {
    setToken(jetonFactice({ expDansSecondes: -60 }))

    afficherDashboard()

    expect(screen.getByText('Page de connexion')).toBeInTheDocument()
    expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
  })

  it('affiche la barre de navigation avec le compte connecté', () => {
    setToken(jetonFactice({ sub: 'veilleur@test.fr' }))

    afficherDashboard()

    expect(screen.getByText('veilleur@test.fr')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /se déconnecter/i })).toBeInTheDocument()
  })
})
