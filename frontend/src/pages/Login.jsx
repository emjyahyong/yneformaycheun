import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import AuthLayout from '../components/AuthLayout'
import { ErrorBanner, Field, PrimaryButton } from '../components/Form'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const cible = location.state?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  const soumettre = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(cible, { replace: true })
    } catch (err) {
      setErreur(err.status === 401 ? 'E-mail ou mot de passe incorrect.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      titre="Connexion"
      sousTitre="Accédez à vos sources et à votre fil d'articles."
      bas={
        <>
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-accent-600 font-semibold">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={soumettre} noValidate>
        <ErrorBanner message={erreur} />
        <Field
          label="E-mail"
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Mot de passe"
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryButton loading={loading}>Se connecter</PrimaryButton>
      </form>
    </AuthLayout>
  )
}
