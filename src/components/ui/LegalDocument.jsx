import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/LanguageProvider.jsx'
import { LangToggle } from './LangToggle.jsx'
import { CONTACT_EMAIL } from '../../constants/legalContent.js'

export function LegalDocument({ titleKey, sections }) {
  const { lang, t } = useI18n()
  const content = sections[lang] || sections.en

  return (
    <main className="flex min-h-dvh flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <header className="mb-8 flex items-start justify-between">
          <Link to="/login" className="group" title={t('legal.back')}>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent font-display text-lg font-bold text-accent-ink">
              F
            </div>
            <p className="kbd text-[10px] text-ink-3 transition-colors group-hover:text-accent">
              ← {t('legal.back')}
            </p>
          </Link>
          <LangToggle />
        </header>

        <h1 className="mb-2 text-[clamp(1.75rem,5vw,2.5rem)] font-bold">{t(titleKey)}</h1>
        <p className="kbd mb-10 text-[11px] text-ink-3">{t('app.name')}</p>

        <div className="space-y-10">
          {content.map((s) => (
            <section key={s.title}>
              <h2 className="mb-2 text-[clamp(1rem,2.5vw,1.25rem)] font-semibold">{s.title}</h2>
              <p className="text-sm leading-relaxed text-ink-2">{s.body}</p>
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t border-rule pt-6 text-center">
          <p className="kbd text-[10px] text-ink-3">{CONTACT_EMAIL}</p>
        </footer>
      </div>
    </main>
  )
}