import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Corners from './Corners'
import { LogOut } from './Icons'

export default function Navbar() {
  const { email, logout } = useAuth()
  const navigate = useNavigate()

  const lien = ({ isActive }) =>
    `text-sm ${isActive ? 'text-accent-600' : 'hover:text-accent-600'}`

  const deconnexion = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="flex items-center gap-6 px-6 py-4 border-b border-divider">
      <span className="font-heading font-semibold text-lg mr-auto">Yneformaycheun</span>
      <NavLink to="/" end className={lien}>
        Dashboard
      </NavLink>
      <NavLink to="/sources" className={lien}>
        Sources
      </NavLink>
      {email && <span className="text-xs text-ink/45 hidden sm:inline">{email}</span>}
      <button
        type="button"
        onClick={deconnexion}
        aria-label="Se déconnecter"
        title="Se déconnecter"
        className="relative w-[34px] h-[34px] inline-flex items-center justify-center border border-divider hover:text-accent-600"
      >
        <Corners />
        <LogOut size={16} />
      </button>
    </nav>
  )
}
