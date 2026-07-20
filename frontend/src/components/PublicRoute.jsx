import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

// Pages publiques (landing, connexion, inscription) : un utilisateur déjà
// authentifié est renvoyé vers l'application plutôt que vers le marketing.
export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
