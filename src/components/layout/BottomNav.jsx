import { NavLink } from 'react-router-dom'
import { useT } from '../../i18n/LanguageProvider.jsx'
import { LangToggle } from '../ui/LangToggle.jsx'

const items = [
  { to: '/dashboard', labelKey: 'nav.dashboard' },
  { to: '/ledger', labelKey: 'nav.ledger' },
]

export function BottomNav() {
  const t = useT()

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch justify-around gap-1 px-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-[var(--radius-btn)] px-2 text-sm font-medium transition-colors duration-[var(--dur-fast)] ${
                isActive ? 'bg-accent-soft text-accent' : 'text-ink-2 hover:text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                <span className="truncate">{t(item.labelKey)}</span>
              </>
            )}
          </NavLink>
        ))}
        <div className="flex flex-1 items-center justify-center">
          <LangToggle />
        </div>
      </div>
    </nav>
  )
}
