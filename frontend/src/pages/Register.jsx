import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import AuthLayout from '../components/AuthLayout'
import { ErrorBanner, Field, PrimaryButton } from '../components/Form'

export default function Register() {
  const { register, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  const soumettre = async (e) => {
    e.preventDefault()
    setErreur('')
    if (password.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    setLoading(true)
    try {
      await register({ email, username, password })
      // Connexion automatique après inscription réussie.
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (err.code === 'EMAIL_DEJA_UTILISE') {
        setErreur('Un compte existe déjà pour cet e-mail.')
      } else {
        setErreur(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      titre="Créer un compte"
      sousTitre="Quelques secondes pour commencer votre veille."
      bas={
        <>
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-accent-600 font-semibold">
            Se connecter
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
          label="Nom d'utilisateur"
          id="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Field
          label="Mot de passe"
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8 caractères minimum"
        />
        <PrimaryButton loading={loading}>Créer mon compte</PrimaryButton>
      </form>
    </AuthLayout>
  )
}
