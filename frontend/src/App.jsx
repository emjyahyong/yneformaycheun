import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ArticleDetail from './pages/ArticleDetail'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Sources from './pages/Sources'

export default function App() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Pages protégées (redirigent vers /login sans jeton valide) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sources"
        element={
          <ProtectedRoute>
            <Sources />
          </ProtectedRoute>
        }
      />
      <Route
        path="/article/:id"
        element={
          <ProtectedRoute>
            <ArticleDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
