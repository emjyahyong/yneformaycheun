import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api, clearToken, getToken, setToken, setUnauthorizedHandler } from '../api/client'

const AuthContext = createContext(null)

// Décode le sujet (e-mail) et l'expiration du JWT sans vérifier la signature —
// suffisant côté client pour l'affichage et l'anticipation d'un jeton expiré.
function decodePayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function tokenValide(token) {
  const payload = token && decodePayload(token)
  if (!payload) return false
  if (payload.exp && payload.exp * 1000 < Date.now()) return false
  return true
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => {
    const t = getToken()
    return tokenValide(t) ? t : null
  })

  const payload = token ? decodePayload(token) : null
  const email = payload?.sub || null

  const login = useCallback(async (identifiant, motDePasse) => {
    const res = await api.login({ email: identifiant, password: motDePasse })
    setToken(res.token)
    setTokenState(res.token)
  }, [])

  const register = useCallback((data) => api.register(data), [])

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
  }, [])

  useEffect(() => {
    // Sur 401 émis par le client API, on vide la session.
    setUnauthorizedHandler(() => setTokenState(null))
  }, [])

  const value = { token, email, isAuthenticated: !!token, login, register, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return ctx
}
