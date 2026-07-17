import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Navbar from './Navbar'

// Garde d'accès : sans jeton valide, redirige vers la connexion en mémorisant
// la page demandée. Sinon, rend la page avec la barre de navigation.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
