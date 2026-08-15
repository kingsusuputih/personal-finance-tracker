import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { useT } from '../../i18n/LanguageProvider.jsx'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const t = useT()

  const doLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-accent font-display text-xs font-bold text-accent-ink">
          F
        </span>
        <div className="flex items-center gap-2">
          {user?.picture ? (
            <img
              src={user.picture}
              alt=""
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-paper-3" />
          )}
          <button
            onClick={doLogout}
            aria-label={t('nav.signOut')}
            className="rounded p-2 text-ink-3 transition-colors hover:bg-paper-2 hover:text-danger"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
