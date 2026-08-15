import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/ledger', label: 'Ledger' },
]

export function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const doLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="font-display text-base font-semibold tracking-tight text-ink">
          Finance Tracker
        </span>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors duration-[var(--dur-fast)] ${
                  isActive ? 'text-accent' : 'text-ink-2 hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={doLogout}
            className="px-3 py-2 text-sm font-medium text-ink-3 transition-colors hover:text-danger"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  )
}
